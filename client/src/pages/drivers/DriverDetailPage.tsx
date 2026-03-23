import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { driverService } from '@/services/driverService';
import { ticketService } from '@/services/ticketService';
import type { Driver, Ticket } from '@/types';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { Table, type Column } from '@/components/ui/Table';
import { formatCurrency, formatDate, formatDateTime } from '@/utils/format';
import { getComplianceBadgeVariant, getTicketStatusBadgeVariant } from '@/utils/status';
import styles from './DriverDetailPage.module.css';

export const DriverDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [driver, setDriver] = useState<Driver | null>(null);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useDocumentTitle(driver ? driver.full_name : 'Driver Detail');

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const [driverData, ticketData] = await Promise.all([
          driverService.getDriver(id),
          ticketService.getTickets({ driver_id: id, pageSize: 50 }),
        ]);
        setDriver(driverData);
        setTickets(ticketData.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load driver.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className={styles.loading}>
        <Spinner size="lg" />
      </div>
    );
  }

  if (error || !driver) {
    return (
      <div className={styles.error}>
        <p>{error || 'Driver not found.'}</p>
        <Button variant="secondary" onClick={() => navigate('/drivers')}>
          Back to Drivers
        </Button>
      </div>
    );
  }

  const ticketColumns: Column<Record<string, unknown>>[] = [
    { key: 'ticket_number', header: 'Ticket #' },
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
      <Button variant="ghost" onClick={() => navigate('/drivers')} className={styles.backButton}>
        &larr; Back to Drivers
      </Button>

      <div className={styles.profileSection}>
        <div className={styles.photoWrapper}>
          {driver.driver_photo ? (
            <img src={driver.driver_photo} alt={driver.full_name} className={styles.photo} />
          ) : (
            <div className={styles.photoPlaceholder}>
              {driver.full_name.charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        <div className={styles.profileInfo}>
          <div className={styles.nameRow}>
            <h1 className={styles.driverName}>{driver.full_name}</h1>
            <Badge
              label={driver.compliance_status}
              variant={getComplianceBadgeVariant(driver.compliance_status)}
            />
          </div>

          <div className={styles.detailsGrid}>
            <div className={styles.field}>
              <span className={styles.fieldLabel}>Phone</span>
              <span className={styles.fieldValue}>{driver.phone_number}</span>
            </div>
            <div className={styles.field}>
              <span className={styles.fieldLabel}>Plate Number</span>
              <span className={styles.fieldValue}>{driver.plate_number}</span>
            </div>
            <div className={styles.field}>
              <span className={styles.fieldLabel}>Vehicle Type</span>
              <span className={styles.fieldValue}>{driver.vehicle_type}</span>
            </div>
            <div className={styles.field}>
              <span className={styles.fieldLabel}>Biometric Status</span>
              <span className={styles.fieldValue}>{driver.biometric_status}</span>
            </div>
            <div className={styles.field}>
              <span className={styles.fieldLabel}>Biodata Status</span>
              <span className={styles.fieldValue}>{driver.biodata_status}</span>
            </div>
            <div className={styles.field}>
              <span className={styles.fieldLabel}>Enrollment Center</span>
              <span className={styles.fieldValue}>{driver.enrollment_center}</span>
            </div>
            <div className={styles.field}>
              <span className={styles.fieldLabel}>Enrollment Date</span>
              <span className={styles.fieldValue}>
                {driver.enrollment_date ? formatDate(driver.enrollment_date) : 'N/A'}
              </span>
            </div>
            <div className={styles.field}>
              <span className={styles.fieldLabel}>Registered</span>
              <span className={styles.fieldValue}>{formatDateTime(driver.created_at)}</span>
            </div>
          </div>
        </div>
      </div>

      <Card title="Tickets" subtitle={`${tickets.length} ticket(s)`}>
        <Table
          columns={ticketColumns}
          data={tickets as unknown as Record<string, unknown>[]}
          emptyMessage="No tickets for this driver"
        />
      </Card>
    </div>
  );
};
