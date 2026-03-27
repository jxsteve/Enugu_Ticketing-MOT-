import React, { useState, useEffect, useMemo } from 'react';
import { Download, FileSpreadsheet, FileJson, FileText } from 'lucide-react';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Table, type Column } from '@/components/ui/Table';
import { Spinner } from '@/components/ui/Spinner';
import { paymentService } from '@/services/paymentService';
import { formatCurrency, formatDateTime } from '@/utils/format';
import { exportData, type ExportFormat, type ExportColumn } from '@/utils/export';
import type { Payment, PaymentChannel, PaymentStatus } from '@/types';
import styles from './ReportsPage.module.css';

const CHANNELS: PaymentChannel[] = ['Bank Transfer', 'USSD', 'Card', 'POS'];
const STATUSES: PaymentStatus[] = ['Pending', 'Confirmed', 'Failed'];

const statusVariant: Record<PaymentStatus, 'success' | 'warning' | 'danger'> = {
  Confirmed: 'success',
  Pending: 'warning',
  Failed: 'danger',
};

const exportColumns: ExportColumn[] = [
  { key: 'payment_reference', header: 'Payment Ref' },
  { key: 'ticket_id', header: 'Ticket ID' },
  {
    key: 'amount_paid',
    header: 'Amount',
    format: (v) => `₦${Number(v).toLocaleString('en-NG')}`,
  },
  { key: 'channel', header: 'Channel' },
  { key: 'status', header: 'Status' },
  { key: 'receipt_number', header: 'Receipt No.' },
  {
    key: 'paid_at',
    header: 'Paid At',
    format: (v) => (v ? new Date(v as string).toLocaleDateString('en-NG') : ''),
  },
  {
    key: 'reconciled_at',
    header: 'Reconciled At',
    format: (v) => (v ? new Date(v as string).toLocaleDateString('en-NG') : ''),
  },
];

export const ReportsPage: React.FC = () => {
  useDocumentTitle('Reports');
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [channelFilter, setChannelFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    paymentService
      .getPayments()
      .then(setPayments)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    return payments.filter((p) => {
      if (channelFilter && p.channel !== channelFilter) return false;
      if (statusFilter && p.status !== statusFilter) return false;
      if (dateFrom && p.paid_at < dateFrom) return false;
      if (dateTo && p.paid_at > dateTo + 'T23:59:59Z') return false;
      return true;
    });
  }, [payments, channelFilter, statusFilter, dateFrom, dateTo]);

  const totalAmount = useMemo(
    () => filtered.reduce((sum, p) => sum + p.amount_paid, 0),
    [filtered],
  );

  const handleExport = (format: ExportFormat) => {
    const timestamp = new Date().toISOString().slice(0, 10);
    exportData(
      filtered as unknown as Record<string, unknown>[],
      exportColumns,
      format,
      `payment-records-${timestamp}`,
      'Payment Records Export',
    );
  };

  const tableColumns: Column<Record<string, unknown>>[] = [
    {
      key: 'payment_reference',
      header: 'Reference',
      render: (row) => (
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)' }}>
          {row.payment_reference as string}
        </span>
      ),
    },
    { key: 'ticket_id', header: 'Ticket' },
    {
      key: 'amount_paid',
      header: 'Amount',
      render: (row) => (
        <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
          {formatCurrency(row.amount_paid as number)}
        </span>
      ),
    },
    { key: 'channel', header: 'Channel' },
    {
      key: 'status',
      header: 'Status',
      render: (row) => (
        <Badge
          label={row.status as string}
          variant={statusVariant[row.status as PaymentStatus] || 'neutral'}
        />
      ),
    },
    {
      key: 'receipt_number',
      header: 'Receipt',
      render: (row) => (row.receipt_number as string) || '—',
    },
    {
      key: 'paid_at',
      header: 'Paid At',
      render: (row) => formatDateTime(row.paid_at as string),
    },
  ];

  if (loading) {
    return (
      <div className={styles.page}>
        <div className={styles.loading}>
          <Spinner size="lg" />
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Payment Records</h1>
          <p className={styles.pageSubtitle}>
            View, filter, and export payment transaction data
          </p>
        </div>
        <div className={styles.exportGroup}>
          <span className={styles.exportLabel}>Export as:</span>
          <button
            className={styles.exportBtn}
            onClick={() => handleExport('csv')}
            title="Export as CSV"
            disabled={filtered.length === 0}
          >
            <FileSpreadsheet size={16} />
            CSV
          </button>
          <button
            className={styles.exportBtn}
            onClick={() => handleExport('json')}
            title="Export as JSON"
            disabled={filtered.length === 0}
          >
            <FileJson size={16} />
            JSON
          </button>
          <button
            className={styles.exportBtn}
            onClick={() => handleExport('pdf')}
            title="Export as PDF"
            disabled={filtered.length === 0}
          >
            <FileText size={16} />
            PDF
          </button>
        </div>
      </div>

      {/* Filters */}
      <Card title="Filters">
        <div className={styles.filters}>
          <div className={styles.filterGroup}>
            <label className={styles.label}>Channel</label>
            <select
              className={styles.select}
              value={channelFilter}
              onChange={(e) => setChannelFilter(e.target.value)}
            >
              <option value="">All Channels</option>
              {CHANNELS.map((ch) => (
                <option key={ch} value={ch}>
                  {ch}
                </option>
              ))}
            </select>
          </div>
          <div className={styles.filterGroup}>
            <label className={styles.label}>Status</label>
            <select
              className={styles.select}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All Statuses</option>
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <div className={styles.filterGroup}>
            <label className={styles.label}>From</label>
            <input
              type="date"
              className={styles.dateInput}
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
            />
          </div>
          <div className={styles.filterGroup}>
            <label className={styles.label}>To</label>
            <input
              type="date"
              className={styles.dateInput}
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
            />
          </div>
        </div>
      </Card>

      {/* Summary */}
      <div className={styles.summary}>
        <div className={styles.summaryItem}>
          <span className={styles.summaryLabel}>Records</span>
          <span className={styles.summaryValue}>{filtered.length}</span>
        </div>
        <div className={styles.summaryItem}>
          <span className={styles.summaryLabel}>Total Amount</span>
          <span className={styles.summaryValueHighlight}>
            {formatCurrency(totalAmount)}
          </span>
        </div>
      </div>

      {/* Table */}
      <Card title="Payment Records">
        <Table
          columns={tableColumns}
          data={filtered as unknown as Record<string, unknown>[]}
          emptyMessage="No payment records match the selected filters"
        />
      </Card>
    </div>
  );
};
