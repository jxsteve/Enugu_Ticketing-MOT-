import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ticketService } from '@/services/ticketService';
import { driverService } from '@/services/driverService';
import type { Ticket, Driver } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { formatCurrency, formatDate, formatDateTime, formatTicketNumber } from '@/utils/format';
import { getTicketStatusBadgeVariant, getComplianceBadgeVariant } from '@/utils/status';
import {
  User,
  Truck,
  FileText,
  CreditCard,
  MapPin,
  Shield,
  Phone,
  Calendar,
  Hash,
  Fingerprint,
  ClipboardList,
} from 'lucide-react';
import styles from './TicketDetailPage.module.css';

export const TicketDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [driver, setDriver] = useState<Driver | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useDocumentTitle(ticket ? `Ticket ${ticket.ticket_number}` : 'Ticket Detail');

  const isSupervisorOrAdmin = user?.role === 'Supervisor' || user?.role === 'Admin';

  useEffect(() => {
    if (!id) return;

    ticketService
      .getTicket(id)
      .then((t) => {
        setTicket(t);
        return driverService.getDriver(t.driver_id);
      })
      .then(setDriver)
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

  const isPaid = ticket.status === 'Paid';
  const isOverdue = !isPaid && ticket.status !== 'Cancelled' && ticket.status !== 'Waived'
    && new Date(ticket.due_date) < new Date();

  return (
    <div className={styles.page}>
      <Button variant="ghost" onClick={() => navigate('/tickets')} className={styles.backButton}>
        &larr; Back to Tickets
      </Button>

      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h1 className={styles.ticketNumber}>{formatTicketNumber(ticket.ticket_number)}</h1>
          <div className={styles.headerBadges}>
            <Badge
              label={ticket.status}
              variant={getTicketStatusBadgeVariant(ticket.status)}
            />
            {isOverdue && <Badge label="Overdue" variant="danger" />}
          </div>
        </div>
        <div className={styles.headerAmount}>
          <span className={styles.amountLabel}>Fine Amount</span>
          <span className={styles.amountValue}>{formatCurrency(ticket.fine_amount)}</span>
        </div>
      </div>

      {/* Driver & Vehicle Section */}
      {driver && (
        <Card>
          <div className={styles.driverSection}>
            {/* Driver Photo */}
            <div className={styles.driverPhoto}>
              {driver.driver_photo ? (
                <img src={driver.driver_photo} alt={driver.full_name} className={styles.photo} />
              ) : (
                <div className={styles.photoPlaceholder}>
                  {driver.full_name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                </div>
              )}
            </div>

            {/* Driver Info */}
            <div className={styles.driverDetails}>
              <div className={styles.driverHeader}>
                <h2 className={styles.driverName}>{driver.full_name}</h2>
                <Badge
                  label={driver.compliance_status}
                  variant={getComplianceBadgeVariant(driver.compliance_status)}
                />
              </div>

              <div className={styles.infoGrid}>
                <div className={styles.infoItem}>
                  <Phone size={14} className={styles.infoIcon} />
                  <div>
                    <span className={styles.infoLabel}>Phone Number</span>
                    <span className={styles.infoValue}>{driver.phone_number}</span>
                  </div>
                </div>
                <div className={styles.infoItem}>
                  <Hash size={14} className={styles.infoIcon} />
                  <div>
                    <span className={styles.infoLabel}>Plate Number</span>
                    <span className={styles.infoValueMono}>{driver.plate_number}</span>
                  </div>
                </div>
                <div className={styles.infoItem}>
                  <Truck size={14} className={styles.infoIcon} />
                  <div>
                    <span className={styles.infoLabel}>Vehicle Type</span>
                    <span className={styles.infoValue}>{driver.vehicle_type}</span>
                  </div>
                </div>
                <div className={styles.infoItem}>
                  <Fingerprint size={14} className={styles.infoIcon} />
                  <div>
                    <span className={styles.infoLabel}>Biometric Status</span>
                    <span className={styles.infoValue}>{driver.biometric_status}</span>
                  </div>
                </div>
                <div className={styles.infoItem}>
                  <ClipboardList size={14} className={styles.infoIcon} />
                  <div>
                    <span className={styles.infoLabel}>Biodata Status</span>
                    <span className={styles.infoValue}>{driver.biodata_status}</span>
                  </div>
                </div>
                <div className={styles.infoItem}>
                  <Calendar size={14} className={styles.infoIcon} />
                  <div>
                    <span className={styles.infoLabel}>Enrollment Date</span>
                    <span className={styles.infoValue}>
                      {driver.enrollment_date ? formatDate(driver.enrollment_date) : 'Not enrolled'}
                    </span>
                  </div>
                </div>
                {driver.enrollment_center && (
                  <div className={styles.infoItem}>
                    <MapPin size={14} className={styles.infoIcon} />
                    <div>
                      <span className={styles.infoLabel}>Enrollment Center</span>
                      <span className={styles.infoValue}>{driver.enrollment_center}</span>
                    </div>
                  </div>
                )}
                <div className={styles.infoItem}>
                  <User size={14} className={styles.infoIcon} />
                  <div>
                    <span className={styles.infoLabel}>Driver ID</span>
                    <span
                      className={styles.infoLink}
                      onClick={() => navigate(`/drivers/${driver.id}`)}
                    >
                      {driver.id}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Ticket Details & Payment */}
      <div className={styles.grid}>
        <Card>
          <div className={styles.cardHeader}>
            <FileText size={16} />
            <h3 className={styles.cardTitle}>Ticket Details</h3>
          </div>
          <div className={styles.fieldsGrid}>
            <div className={styles.field}>
              <span className={styles.label}>Offence</span>
              <span className={styles.value}>{ticket.offence_description}</span>
            </div>
            <div className={styles.field}>
              <span className={styles.label}>Offence Code</span>
              <span className={styles.valueMono}>{ticket.offence_code}</span>
            </div>
            <div className={styles.field}>
              <span className={styles.label}>Issued At</span>
              <span className={styles.value}>{formatDateTime(ticket.issued_at)}</span>
            </div>
            <div className={styles.field}>
              <span className={styles.label}>Due Date</span>
              <span className={`${styles.value} ${isOverdue ? styles.overdue : ''}`}>
                {formatDate(ticket.due_date)}
              </span>
            </div>
            <div className={styles.field}>
              <span className={styles.label}>Location</span>
              <span className={styles.value}>{ticket.location || '—'}</span>
            </div>
            <div className={styles.field}>
              <span className={styles.label}>Issued By</span>
              <span className={styles.value}>{ticket.agent_name}</span>
            </div>
            <div className={styles.field}>
              <span className={styles.label}>Agent ID</span>
              <span className={styles.valueMono}>{ticket.agent_id}</span>
            </div>
          </div>
        </Card>

        <Card>
          <div className={styles.cardHeader}>
            <CreditCard size={16} />
            <h3 className={styles.cardTitle}>Payment Information</h3>
          </div>
          <div className={styles.fieldsGrid}>
            <div className={styles.field}>
              <span className={styles.label}>Fine Amount</span>
              <span className={styles.valueAmount}>{formatCurrency(ticket.fine_amount)}</span>
            </div>
            <div className={styles.field}>
              <span className={styles.label}>Payment Status</span>
              <Badge
                label={ticket.status}
                variant={getTicketStatusBadgeVariant(ticket.status)}
              />
            </div>
            <div className={styles.field}>
              <span className={styles.label}>Payment Reference</span>
              <span className={styles.valueMono}>{ticket.payment_reference || '—'}</span>
            </div>
            <div className={styles.field}>
              <span className={styles.label}>Paid At</span>
              <span className={styles.value}>
                {ticket.paid_at ? formatDateTime(ticket.paid_at) : '—'}
              </span>
            </div>
            <div className={styles.field}>
              <span className={styles.label}>Receipt Number</span>
              <span className={styles.valueMono}>{ticket.receipt_number || '—'}</span>
            </div>
          </div>

          {isPaid && (
            <div className={styles.paidBanner}>
              <Shield size={16} />
              <span>Payment confirmed and receipt issued</span>
            </div>
          )}
        </Card>
      </div>

      {/* Actions */}
      {isSupervisorOrAdmin && (ticket.status === 'Unpaid' || ticket.status === 'Partial Payment') && (
        <div className={styles.actions}>
          <Button variant="danger" onClick={() => alert('Cancel ticket — not yet implemented')}>
            Cancel Ticket
          </Button>
          <Button variant="secondary" onClick={() => alert('Waive ticket — not yet implemented')}>
            Waive Ticket
          </Button>
        </div>
      )}
    </div>
  );
};
