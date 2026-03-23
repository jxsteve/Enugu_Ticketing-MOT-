import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ticketService } from '@/services/ticketService';
import type { Ticket } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { formatCurrency, formatDate, formatDateTime, formatTicketNumber } from '@/utils/format';
import { getTicketStatusBadgeVariant } from '@/utils/status';
import styles from './TicketDetailPage.module.css';

export const TicketDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useDocumentTitle(ticket ? `Ticket ${ticket.ticket_number}` : 'Ticket Detail');

  const isSupervisorOrAdmin = user?.role === 'Supervisor' || user?.role === 'Admin';

  useEffect(() => {
    if (!id) return;

    ticketService
      .getTicket(id)
      .then(setTicket)
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load ticket.'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className={styles.loading}>
        <Spinner size="lg" />
      </div>
    );
  }

  if (error || !ticket) {
    return (
      <div className={styles.error}>
        <p>{error || 'Ticket not found.'}</p>
        <Button variant="secondary" onClick={() => navigate('/tickets')}>
          Back to Tickets
        </Button>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <Button variant="ghost" onClick={() => navigate('/tickets')} className={styles.backButton}>
        &larr; Back to Tickets
      </Button>

      <div className={styles.titleRow}>
        <h1 className={styles.ticketNumber}>{formatTicketNumber(ticket.ticket_number)}</h1>
        <Badge
          label={ticket.status}
          variant={getTicketStatusBadgeVariant(ticket.status)}
        />
      </div>

      <div className={styles.grid}>
        <Card title="Ticket Information">
          <div className={styles.fieldsGrid}>
            <div className={styles.field}>
              <span className={styles.label}>Offence</span>
              <span className={styles.value}>{ticket.offence_description}</span>
            </div>
            <div className={styles.field}>
              <span className={styles.label}>Offence Code</span>
              <span className={styles.value}>{ticket.offence_code}</span>
            </div>
            <div className={styles.field}>
              <span className={styles.label}>Fine Amount</span>
              <span className={styles.value}>{formatCurrency(ticket.fine_amount)}</span>
            </div>
            <div className={styles.field}>
              <span className={styles.label}>Issued At</span>
              <span className={styles.value}>{formatDateTime(ticket.issued_at)}</span>
            </div>
            <div className={styles.field}>
              <span className={styles.label}>Due Date</span>
              <span className={styles.value}>{formatDate(ticket.due_date)}</span>
            </div>
            <div className={styles.field}>
              <span className={styles.label}>Location</span>
              <span className={styles.value}>{ticket.location || '-'}</span>
            </div>
            <div className={styles.field}>
              <span className={styles.label}>Payment Reference</span>
              <span className={styles.value}>{ticket.payment_reference || '-'}</span>
            </div>
            <div className={styles.field}>
              <span className={styles.label}>Paid At</span>
              <span className={styles.value}>{ticket.paid_at ? formatDateTime(ticket.paid_at) : '-'}</span>
            </div>
            <div className={styles.field}>
              <span className={styles.label}>Receipt Number</span>
              <span className={styles.value}>{ticket.receipt_number || '-'}</span>
            </div>
          </div>
        </Card>

        <Card title="Driver / Agent">
          <div className={styles.fieldsGrid}>
            <div className={styles.field}>
              <span className={styles.label}>Driver ID</span>
              <span
                className={styles.link}
                onClick={() => navigate(`/drivers/${ticket.driver_id}`)}
              >
                {ticket.driver_id}
              </span>
            </div>
            <div className={styles.field}>
              <span className={styles.label}>Plate Number</span>
              <span className={styles.value}>{ticket.plate_number}</span>
            </div>
            <div className={styles.field}>
              <span className={styles.label}>Issued By</span>
              <span className={styles.value}>{ticket.agent_name}</span>
            </div>
            <div className={styles.field}>
              <span className={styles.label}>Agent ID</span>
              <span className={styles.value}>{ticket.agent_id}</span>
            </div>
          </div>
        </Card>
      </div>

      {isSupervisorOrAdmin && (ticket.status === 'Unpaid' || ticket.status === 'Partial Payment') && (
        <div className={styles.actions}>
          <Button variant="danger" onClick={() => alert('Cancel ticket - not yet implemented')}>
            Cancel Ticket
          </Button>
          <Button variant="secondary" onClick={() => alert('Waive ticket - not yet implemented')}>
            Waive Ticket
          </Button>
        </div>
      )}
    </div>
  );
};
