type ExportFormat = 'csv' | 'json' | 'pdf';

interface ExportColumn {
  key: string;
  header: string;
  format?: (value: unknown) => string;
}

function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function getCellValue(row: Record<string, unknown>, col: ExportColumn): string {
  const raw = row[col.key];
  if (col.format) return col.format(raw);
  if (raw == null) return '';
  return String(raw);
}

function escapeCsv(value: string): string {
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

function exportCsv(
  data: Record<string, unknown>[],
  columns: ExportColumn[],
  filename: string,
) {
  const header = columns.map((c) => escapeCsv(c.header)).join(',');
  const rows = data.map((row) =>
    columns.map((col) => escapeCsv(getCellValue(row, col))).join(','),
  );
  downloadFile([header, ...rows].join('\n'), `${filename}.csv`, 'text/csv');
}

function exportJson(
  data: Record<string, unknown>[],
  columns: ExportColumn[],
  filename: string,
) {
  const mapped = data.map((row) => {
    const obj: Record<string, string> = {};
    columns.forEach((col) => {
      obj[col.header] = getCellValue(row, col);
    });
    return obj;
  });
  downloadFile(
    JSON.stringify(mapped, null, 2),
    `${filename}.json`,
    'application/json',
  );
}

function exportPdf(
  data: Record<string, unknown>[],
  columns: ExportColumn[],
  filename: string,
  title: string,
) {
  const colWidths = columns.map((col) => {
    const headerLen = col.header.length;
    const maxDataLen = data.reduce((max, row) => {
      const val = getCellValue(row, col);
      return Math.max(max, val.length);
    }, 0);
    return Math.max(headerLen, maxDataLen);
  });

  const totalChars = colWidths.reduce((s, w) => s + w, 0);
  const pageWidth = 595; // A4 width in points
  const margin = 40;
  const usable = pageWidth - margin * 2;
  const cellPadding = 6;
  const rowHeight = 20;
  const headerHeight = 24;
  const pageHeight = 842; // A4 height
  const titleHeight = 50;

  const colPxWidths = colWidths.map(
    (w) => Math.max((w / totalChars) * usable, 60),
  );

  let y = margin + titleHeight;
  let pageNum = 1;

  const lines: string[] = [];

  // PDF header
  lines.push('%PDF-1.4');
  const objects: string[] = [];
  const pageObjects: number[] = [];
  let objCount = 0;

  function addObj(content: string): number {
    objCount++;
    objects.push(`${objCount} 0 obj\n${content}\nendobj`);
    return objCount;
  }

  // We'll build a simple single-page stream approach
  // Build the content stream
  let stream = '';

  function addText(text: string, x: number, ty: number, size: number, bold = false) {
    const fontRef = bold ? '/F2' : '/F1';
    const escaped = text
      .replace(/\\/g, '\\\\')
      .replace(/\(/g, '\\(')
      .replace(/\)/g, '\\)');
    stream += `BT ${fontRef} ${size} Tf ${x} ${ty} Td (${escaped}) Tj ET\n`;
  }

  function addRect(x: number, ry: number, w: number, h: number, fill: string) {
    stream += `${fill} ${x} ${ry} ${w} ${h} re f\n`;
  }

  function addLine(x1: number, ly1: number, x2: number, ly2: number) {
    stream += `0.8 0.8 0.8 RG 0.5 w ${x1} ${ly1} m ${x2} ${ly2} l S\n`;
  }

  // Title
  addText(title, margin, pageHeight - margin - 20, 16, true);
  addText(
    `Generated: ${new Date().toLocaleDateString('en-NG', { year: 'numeric', month: 'long', day: 'numeric' })}`,
    margin,
    pageHeight - margin - 38,
    9,
  );

  // Table header background
  const tableTop = pageHeight - y;
  addRect(margin, tableTop - headerHeight, usable, headerHeight, '0.15 0.15 0.18 rg');

  // Header text
  let hx = margin;
  columns.forEach((col, i) => {
    addText(col.header, hx + cellPadding, tableTop - 16, 9, true);
    hx += colPxWidths[i];
  });

  // Set header text color to white (applied via separate stream section)
  // We'll rebuild with proper color management
  stream = ''; // Reset and rebuild with colors

  // Title in dark color
  stream += '0.1 0.1 0.1 rg\n';
  addText(title, margin, pageHeight - margin - 20, 16, true);
  stream += '0.4 0.4 0.4 rg\n';
  addText(
    `Generated: ${new Date().toLocaleDateString('en-NG', { year: 'numeric', month: 'long', day: 'numeric' })}`,
    margin,
    pageHeight - margin - 38,
    9,
  );

  // Header row
  addRect(margin, tableTop - headerHeight, usable, headerHeight, '0.18 0.2 0.25 rg');
  stream += '1 1 1 rg\n';
  hx = margin;
  columns.forEach((col, i) => {
    addText(col.header, hx + cellPadding, tableTop - 16, 8, true);
    hx += colPxWidths[i];
  });

  // Data rows
  stream += '0.15 0.15 0.15 rg\n';
  y += headerHeight;

  data.forEach((row, rowIdx) => {
    const rowTop = pageHeight - y;

    // Alternating row background
    if (rowIdx % 2 === 0) {
      addRect(margin, rowTop - rowHeight, usable, rowHeight, '0.96 0.96 0.97 rg');
    }

    // Row border
    addLine(margin, rowTop - rowHeight, margin + usable, rowTop - rowHeight);

    stream += '0.15 0.15 0.15 rg\n';
    let rx = margin;
    columns.forEach((col, i) => {
      const val = getCellValue(row, col);
      const truncated = val.length > 30 ? val.slice(0, 27) + '...' : val;
      addText(truncated, rx + cellPadding, rowTop - 14, 8);
      rx += colPxWidths[i];
    });

    y += rowHeight;
  });

  // Footer
  y += 10;
  stream += '0.5 0.5 0.5 rg\n';
  addText(
    `Total records: ${data.length}`,
    margin,
    pageHeight - y - 10,
    8,
  );

  // Build PDF objects
  // 1: Catalog
  addObj('<< /Type /Catalog /Pages 2 0 R >>');
  // 2: Pages
  addObj('<< /Type /Pages /Kids [4 0 R] /Count 1 >>');
  // 3: Font Helvetica
  addObj('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>');
  // Font Bold
  const boldFontObj = addObj('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>');
  // 4: Page
  const streamObj = objCount + 2;
  addObj(
    `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pageWidth} ${pageHeight}] /Contents ${streamObj} 0 R /Resources << /Font << /F1 3 0 R /F2 ${boldFontObj} 0 R >> >> >>`,
  );
  // 5: Stream
  const streamBytes = new TextEncoder().encode(stream);
  addObj(
    `<< /Length ${streamBytes.length} >>\nstream\n${stream}endstream`,
  );

  // Build final PDF
  const pdfParts: string[] = ['%PDF-1.4\n'];
  const offsets: number[] = [];
  let currentOffset = pdfParts[0].length;

  objects.forEach((obj) => {
    offsets.push(currentOffset);
    const objStr = obj + '\n';
    pdfParts.push(objStr);
    currentOffset += objStr.length;
  });

  // XRef
  const xrefOffset = currentOffset;
  const xrefLines = [`xref\n0 ${objCount + 1}\n0000000000 65535 f \n`];
  offsets.forEach((offset) => {
    xrefLines.push(`${String(offset).padStart(10, '0')} 00000 n \n`);
  });

  pdfParts.push(xrefLines.join(''));
  pdfParts.push(`trailer\n<< /Size ${objCount + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`);

  downloadFile(pdfParts.join(''), `${filename}.pdf`, 'application/pdf');
}

export function exportData(
  data: Record<string, unknown>[],
  columns: ExportColumn[],
  format: ExportFormat,
  filename: string,
  title?: string,
) {
  switch (format) {
    case 'csv':
      exportCsv(data, columns, filename);
      break;
    case 'json':
      exportJson(data, columns, filename);
      break;
    case 'pdf':
      exportPdf(data, columns, filename, title || filename);
      break;
  }
}

export type { ExportFormat, ExportColumn };
