import React, { useState, useEffect } from 'react';
import { driverService } from '@/services/driverService';
import { ticketService } from '@/services/ticketService';
import { offenceService } from '@/services/offenceService';
import type { Driver, Offence } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { formatCurrency } from '@/utils/format';
import { getComplianceBadgeVariant, getComplianceColor } from '@/utils/status';
import styles from './EnforcementPage.module.css';

export const EnforcementPage: React.FC = () => {
  useDocumentTitle('Enforcement');
  const { user } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const [driver, setDriver] = useState<Driver | null>(null);
  const [offences, setOffences] = useState<Offence[]>([]);
  const [selectedOffence, setSelectedOffence] = useState('');
  const [loading, setLoading] = useState(false);
  const [issuing, setIssuing] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    offenceService.getOffences().then(setOffences).catch(console.error);
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setLoading(true);
    setDriver(null);
    setSuccessMessage('');
    setError('');
    setSelectedOffence('');

    try {
      const results = await driverService.searchDrivers(searchQuery);
      if (results.length > 0) {
        setDriver(results[0]);
      } else {
        setError('No driver found matching that search.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed.');
    } finally {
      setLoading(false);
    }
  };

  const selectedOffenceData = offences.find((o) => o.code === selectedOffence);

  const handleIssueTicket = async () => {
    if (!driver || !selectedOffenceData || !user) return;

    setIssuing(true);
    setError('');

    try {
      const ticket = await ticketService.createTicket({
        driver_id: driver.id,
        plate_number: driver.plate_number,
        offence_code: selectedOffenceData.code,
        offence_description: selectedOffenceData.description,
        fine_amount: selectedOffenceData.amount,
        location: '',
        agent_id: user.agent_id || user.id,
        agent_name: user.name,
      });
      setSuccessMessage(`Ticket ${ticket.ticket_number} issued successfully!`);
      setSelectedOffence('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to issue ticket.');
    } finally {
      setIssuing(false);
    }
  };

  return (
    <div className={styles.page}>
      <h1 className={styles.pageTitle}>Enforcement</h1>

      <form className={styles.searchForm} onSubmit={handleSearch}>
        <input
          className={styles.searchInput}
          type="text"
          placeholder="Search by plate number, name, or phone..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Button type="submit" loading={loading}>
          Search
        </Button>
      </form>

      {error && <div className={styles.error}>{error}</div>}
      {successMessage && <div className={styles.success}>{successMessage}</div>}

      {loading && (
        <div className={styles.loading}>
          <Spinner size="lg" />
        </div>
      )}

      {driver && !loading && (
        <Card className={styles.driverCard}>
          <div className={styles.driverHeader}>
            <div className={styles.driverPhoto}>
              {driver.driver_photo ? (
                <img src={driver.driver_photo} alt={driver.full_name} className={styles.photo} />
              ) : (
                <div className={styles.photoPlaceholder}>
                  {driver.full_name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>

            <div className={styles.driverInfo}>
              <h2 className={styles.driverName}>{driver.full_name}</h2>
              <p className={styles.driverPlate}>{driver.plate_number}</p>
              <p className={styles.driverType}>{driver.vehicle_type} | {driver.phone_number}</p>
            </div>

            <div
              className={styles.complianceStatus}
              style={{ borderColor: getComplianceColor(driver.compliance_status) }}
            >
              <Badge
                label={driver.compliance_status}
                variant={getComplianceBadgeVariant(driver.compliance_status)}
              />
            </div>
          </div>

          {driver.compliance_status !== 'Compliant' && !successMessage && (
            <div className={styles.ticketSection}>
              <h3 className={styles.ticketTitle}>Issue Ticket</h3>

              <div className={styles.offenceSelect}>
                <label className={styles.selectLabel}>Offence</label>
                <select
                  className={styles.select}
                  value={selectedOffence}
                  onChange={(e) => setSelectedOffence(e.target.value)}
                >
                  <option value="">Select an offence...</option>
                  {offences
                    .filter((o) => o.is_active)
                    .map((o) => (
                      <option key={o.code} value={o.code}>
                        {o.description}
                      </option>
                    ))}
                </select>
              </div>

              {selectedOffenceData && (
                <div className={styles.fineAmount}>
                  Fine Amount: <strong>{formatCurrency(selectedOffenceData.amount)}</strong>
                </div>
              )}

              <Button
                variant="danger"
                onClick={handleIssueTicket}
                loading={issuing}
                disabled={!selectedOffence}
                className={styles.issueButton}
              >
                Confirm &amp; Issue Ticket
              </Button>
            </div>
          )}
        </Card>
      )}
    </div>
  );
};
