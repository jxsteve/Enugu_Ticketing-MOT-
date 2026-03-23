import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ticketService } from '@/services/ticketService';
import type { Ticket, TicketStatus } from '@/types';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { usePagination } from '@/hooks/usePagination';
import { Badge } from '@/components/ui/Badge';
import { Spinner } from '@/components/ui/Spinner';
import { Table, type Column } from '@/components/ui/Table';
import { formatCurrency, formatDate, formatTicketNumber } from '@/utils/format';
import { getTicketStatusBadgeVariant } from '@/utils/status';
import { TICKET_STATUSES } from '@/utils/constants';
import styles from './TicketsPage.module.css';

export const TicketsPage: React.FC = () => {
  useDocumentTitle('Tickets');
  const navigate = useNavigate();
  const { page, pageSize, setPage } = usePagination();

  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [statusFilter, setStatusFilter] = useState<TicketStatus | ''>('');
  const [loading, setLoading] = useState(true);

  const fetchTickets = useCallback(async () => {
    setLoading(true);
    try {
      const result = await ticketService.getTickets({
        page,
        pageSize,
        status: statusFilter || undefined,
      });
      setTickets(result.data);
      setTotal(result.total);
      setTotalPages(result.total_pages);
    } catch (err) {
      console.error('Failed to fetch tickets:', err);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, statusFilter]);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  const handleStatusChange = (value: string) => {
    setStatusFilter(value as TicketStatus | '');
    setPage(1);
  };

  const columns: Column<Record<string, unknown>>[] = [
    {
      key: 'ticket_number',
      header: 'Ticket #',
      render: (row) => (
        <span
          className={styles.ticketLink}
          onClick={() => navigate(`/tickets/${row.id}`)}
        >
          {formatTicketNumber(row.ticket_number as string)}
        </span>
      ),
    },
    { key: 'plate_number', header: 'Plate' },
    { key: 'offence_description', header: 'Offence' },
    {
      key: 'fine_amount',
      header: 'Amount',
      render: (row) => formatCurrency(row.fine_amount as number),
    },
    {
      key: 'status',
      header: 'Status',
      render: (row) => (
        <Badge
          label={row.status as string}
          variant={getTicketStatusBadgeVariant(row.status as Ticket['status'])}
        />
      ),
    },
    {
      key: 'issued_at',
      header: 'Date',
      render: (row) => formatDate(row.issued_at as string),
    },
  ];

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.pageTitle}>Tickets</h1>
        <span className={styles.count}>{total} total</span>
      </div>

      <div className={styles.filters}>
        <select
          className={styles.select}
          value={statusFilter}
          onChange={(e) => handleStatusChange(e.target.value)}
        >
          <option value="">All Statuses</option>
          {TICKET_STATUSES.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className={styles.loading}>
          <Spinner size="lg" />
        </div>
      ) : (
        <>
          <Table
            columns={columns}
            data={tickets as unknown as Record<string, unknown>[]}
            emptyMessage="No tickets found"
          />

          {totalPages > 1 && (
            <div className={styles.pagination}>
              <button
                className={styles.pageButton}
                disabled={page <= 1}
                onClick={() => setPage(page - 1)}
              >
                Previous
              </button>
              <span className={styles.pageInfo}>
                Page {page} of {totalPages}
              </span>
              <button
                className={styles.pageButton}
                disabled={page >= totalPages}
                onClick={() => setPage(page + 1)}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};
