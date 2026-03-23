export function formatCurrency(amount: number): string {
  return `\u20A6${amount.toLocaleString('en-NG')}`;
}

export function formatDate(iso: string): string {
  if (!iso) return '-';
  const date = new Date(iso);
  return date.toLocaleDateString('en-NG', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function formatDateTime(iso: string): string {
  if (!iso) return '-';
  const date = new Date(iso);
  return date.toLocaleDateString('en-NG', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatTicketNumber(num: string): string {
  if (!num) return '-';
  return num.toUpperCase();
}
