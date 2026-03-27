import React, { useState, useEffect, useRef } from 'react';
import { driverService } from '@/services/driverService';
import { ticketService } from '@/services/ticketService';
import { offenceService } from '@/services/offenceService';
import type { Driver, Offence, Ticket, VehicleType } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { formatCurrency, formatDateTime } from '@/utils/format';
import { getComplianceBadgeVariant, getComplianceColor, getTicketStatusBadgeVariant } from '@/utils/status';
import {
  CreditCard,
  CheckCircle,
  Printer,
  Copy,
  Building2,
  ShieldCheck,
  QrCode,
  Search,
  UserPlus,
  AlertTriangle,
} from 'lucide-react';
import styles from './EnforcementPage.module.css';

type FlowStep = 'search' | 'ticket-issued' | 'payment-pending' | 'payment-confirmed';
type ActiveTab = 'check' | 'verify';

const VEHICLE_TYPES: VehicleType[] = ['Car', 'Bus', 'Truck', 'Motorcycle', 'Tricycle', 'Other'];

const CENTRAL_ACCOUNT = {
  bank: 'First Bank of Nigeria',
  account_name: 'Enugu State Ministry of Transportation',
  account_number: '3086754321',
};

function generateQRDataUrl(text: string): string {
  return `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(text)}&bgcolor=ffffff&color=000000&margin=8`;
}

export const EnforcementPage: React.FC = () => {
  useDocumentTitle('Enforcement');
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState<ActiveTab>('check');

  // Driver search
  const [searchQuery, setSearchQuery] = useState('');
  const [driver, setDriver] = useState<Driver | null>(null);
  const [offences, setOffences] = useState<Offence[]>([]);
  const [selectedOffence, setSelectedOffence] = useState('');
  const [loading, setLoading] = useState(false);
  const [issuing, setIssuing] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState('');
  const [flowStep, setFlowStep] = useState<FlowStep>('search');
  const [issuedTicket, setIssuedTicket] = useState<Ticket | null>(null);
  const [copied, setCopied] = useState(false);
  const [recentPaidTickets, setRecentPaidTickets] = useState<Ticket[]>([]);
  const [searched, setSearched] = useState(false);
  const receiptRef = useRef<HTMLDivElement>(null);

  // New driver registration
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const [registerForm, setRegisterForm] = useState({
    full_name: '',
    phone_number: '',
    plate_number: '',
    vehicle_type: '' as VehicleType | '',
  });
  const [registering, setRegistering] = useState(false);
  const [registerError, setRegisterError] = useState('');
  const [duplicateDriver, setDuplicateDriver] = useState<Driver | null>(null);

  // Receipt verification
  const [verifyQuery, setVerifyQuery] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [verifiedTicket, setVerifiedTicket] = useState<Ticket | null>(null);
  const [verifyError, setVerifyError] = useState('');

  useEffect(() => {
    offenceService.getOffences().then(setOffences).catch(console.error);
  }, []);

  const resetSearch = () => {
    setSearchQuery('');
    setDriver(null);
    setIssuedTicket(null);
    setFlowStep('search');
    setSelectedOffence('');
    setError('');
    setRecentPaidTickets([]);
    setSearched(false);
    setShowRegisterForm(false);
    setRegisterError('');
    setDuplicateDriver(null);
    setRegisterForm({ full_name: '', phone_number: '', plate_number: '', vehicle_type: '' });
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setLoading(true);
    setDriver(null);
    setError('');
    setSelectedOffence('');
    setFlowStep('search');
    setIssuedTicket(null);
    setRecentPaidTickets([]);
    setShowRegisterForm(false);
    setRegisterError('');
    setDuplicateDriver(null);

    try {
      const results = await driverService.searchDrivers(searchQuery);
      if (results.length > 0) {
        const found = results[0];
        setDriver(found);
        const paid = await ticketService.getRecentPaidTickets(found.id);
        setRecentPaidTickets(paid);
      }
      setSearched(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterDriver = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!registerForm.full_name || !registerForm.phone_number || !registerForm.plate_number || !registerForm.vehicle_type) {
      setRegisterError('All fields are required.');
      return;
    }

    setRegistering(true);
    setRegisterError('');
    setDuplicateDriver(null);

    try {
      // Check for duplicates first
      const existing = await driverService.checkDuplicate(registerForm.plate_number, registerForm.phone_number);
      if (existing) {
        setDuplicateDriver(existing);
        setRegistering(false);
        return;
      }

      const newDriver = await driverService.createDriver({
        full_name: registerForm.full_name,
        phone_number: registerForm.phone_number,
        plate_number: registerForm.plate_number,
        vehicle_type: registerForm.vehicle_type as VehicleType,
      });
      setDriver(newDriver);
      setShowRegisterForm(false);
    } catch (err) {
      setRegisterError(err instanceof Error ? err.message : 'Registration failed.');
    } finally {
      setRegistering(false);
    }
  };

  const useDuplicateDriver = () => {
    if (duplicateDriver) {
      setDriver(duplicateDriver);
      setShowRegisterForm(false);
      setDuplicateDriver(null);
    }
  };

  const handleVerifyReceipt = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!verifyQuery.trim()) return;

    setVerifying(true);
    setVerifiedTicket(null);
    setVerifyError('');

    try {
      const ticket = await ticketService.verifyReceipt(verifyQuery);
      if (ticket && ticket.status === 'Paid') {
        setVerifiedTicket(ticket);
      } else if (ticket) {
        setVerifyError(`Ticket found but status is "${ticket.status}" — not paid.`);
      } else {
        setVerifyError('No ticket found with that receipt/reference number.');
      }
    } catch (err) {
      setVerifyError(err instanceof Error ? err.message : 'Verification failed.');
    } finally {
      setVerifying(false);
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
      setIssuedTicket(ticket);
      setFlowStep('ticket-issued');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to issue ticket.');
    } finally {
      setIssuing(false);
    }
  };

  const handleProceedToPayment = () => setFlowStep('payment-pending');

  const handleConfirmPayment = async () => {
    if (!issuedTicket) return;
    setConfirming(true);
    setError('');
    try {
      const updated = await ticketService.confirmPayment(issuedTicket.id);
      setIssuedTicket(updated);
      setFlowStep('payment-confirmed');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Payment confirmation failed.');
    } finally {
      setConfirming(false);
    }
  };

  const handleCopyAccount = () => {
    navigator.clipboard.writeText(CENTRAL_ACCOUNT.account_number).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handlePrint = () => {
    if (receiptRef.current) {
      const content = receiptRef.current.innerHTML;
      const win = window.open('', '_blank', 'width=400,height=700');
      if (win) {
        win.document.write(`
          <html>
            <head>
              <title>Receipt - ${issuedTicket?.receipt_number}</title>
              <style>
                * { box-sizing: border-box; margin: 0; padding: 0; }
                body {
                  font-family: 'Inter', 'Helvetica Neue', Arial, sans-serif;
                  padding: 32px;
                  color: #1a1a1a;
                  font-size: 13px;
                  line-height: 1.5;
                  max-width: 420px;
                  margin: 0 auto;
                }
                .receipt-header { text-align: center; border-bottom: 3px solid #16a34a; padding-bottom: 20px; margin-bottom: 20px; }
                .receipt-header h2 { font-size: 15px; font-weight: 700; margin: 0 0 4px; }
                .receipt-header p { color: #666; margin: 0; font-size: 11px; }
                .receipt-badge { display: inline-block; background: #dcfce7; color: #16a34a; padding: 5px 16px; border-radius: 20px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; margin: 8px 0 16px; }
                .receipt-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px 24px; margin: 20px 0; }
                .receipt-field label { font-size: 9px; text-transform: uppercase; letter-spacing: 0.1em; color: #999; display: block; margin-bottom: 4px; font-weight: 600; }
                .receipt-field span { font-size: 13px; font-weight: 600; color: #1a1a1a; display: block; word-break: break-word; }
                .receipt-amount { text-align: center; padding: 20px; background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 10px; margin: 24px 0; }
                .receipt-amount .label { font-size: 10px; color: #666; text-transform: uppercase; letter-spacing: 0.08em; font-weight: 600; margin-bottom: 6px; }
                .receipt-amount .value { font-size: 28px; font-weight: 800; color: #16a34a; }
                .receipt-qr { text-align: center; margin: 20px 0; }
                .receipt-qr img { width: 150px; height: 150px; }
                .receipt-qr p { font-size: 9px; color: #999; margin-top: 6px; }
                .receipt-footer { text-align: center; font-size: 10px; color: #999; border-top: 1px solid #e5e7eb; padding-top: 16px; margin-top: 20px; line-height: 1.6; }
                @media print { body { padding: 20px; } }
              </style>
            </head>
            <body>${content}</body>
          </html>
        `);
        win.document.close();
        win.print();
      }
    }
  };

  const qrData = issuedTicket?.receipt_number
    ? `ENUGU-MOT|${issuedTicket.receipt_number}|${issuedTicket.ticket_number}|${issuedTicket.plate_number}|${issuedTicket.fine_amount}|${issuedTicket.paid_at || ''}`
    : '';

  return (
    <div className={styles.page}>
      <h1 className={styles.pageTitle}>Enforcement</h1>

      {/* Tab Switcher */}
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === 'check' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('check')}
        >
          <Search size={15} />
          Check Driver
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'verify' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('verify')}
        >
          <ShieldCheck size={15} />
          Verify Receipt
        </button>
      </div>

      {/* ── CHECK DRIVER TAB ──────────────────────────────── */}
      {activeTab === 'check' && (
        <div className={styles.tabContent}>
          <form className={styles.searchForm} onSubmit={handleSearch}>
            <div className={styles.searchInputWrapper}>
              <Search size={16} className={styles.searchIcon} />
              <input
                className={styles.searchInput}
                type="search"
                placeholder="Enter plate number, name, or phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Search drivers by plate number, name, or phone"
              />
            </div>
            <Button type="submit" loading={loading}>Search</Button>
          </form>

          {error && <div className={styles.error} role="alert">{error}</div>}

          {loading && (
            <div className={styles.loading}><Spinner size="lg" /></div>
          )}

          {/* No driver found — offer registration */}
          {searched && !driver && !loading && !error && (
            <Card className={styles.notFoundCard}>
              <div className={styles.notFoundContent}>
                <div className={styles.notFoundIcon}>
                  <UserPlus size={24} />
                </div>
                <div>
                  <h3 className={styles.notFoundTitle}>
                    No driver found for "{searchQuery}"
                  </h3>
                  <p className={styles.notFoundDesc}>
                    This driver isn't in the system yet. You can register them to proceed with enforcement.
                  </p>
                </div>
              </div>

              {!showRegisterForm ? (
                <Button
                  variant="primary"
                  onClick={() => setShowRegisterForm(true)}
                  icon={<UserPlus size={16} />}
                >
                  Register New Driver
                </Button>
              ) : (
                <form className={styles.registerForm} onSubmit={handleRegisterDriver}>
                  <div className={styles.registerGrid}>
                    <div className={styles.formField}>
                      <label className={styles.formLabel}>Full Name</label>
                      <input
                        className={styles.formInput}
                        type="text"
                        placeholder="e.g. Chinedu Okafor"
                        value={registerForm.full_name}
                        onChange={(e) => setRegisterForm({ ...registerForm, full_name: e.target.value })}
                      />
                    </div>
                    <div className={styles.formField}>
                      <label className={styles.formLabel}>Phone Number</label>
                      <input
                        className={styles.formInput}
                        type="tel"
                        placeholder="e.g. 08060001001"
                        value={registerForm.phone_number}
                        onChange={(e) => setRegisterForm({ ...registerForm, phone_number: e.target.value })}
                      />
                    </div>
                    <div className={styles.formField}>
                      <label className={styles.formLabel}>Plate Number</label>
                      <input
                        className={styles.formInput}
                        type="text"
                        placeholder="e.g. EN-234-AB"
                        value={registerForm.plate_number}
                        onChange={(e) => setRegisterForm({ ...registerForm, plate_number: e.target.value })}
                      />
                    </div>
                    <div className={styles.formField}>
                      <label className={styles.formLabel}>Vehicle Type</label>
                      <select
                        className={styles.formSelect}
                        value={registerForm.vehicle_type}
                        onChange={(e) => setRegisterForm({ ...registerForm, vehicle_type: e.target.value as VehicleType })}
                      >
                        <option value="">Select type...</option>
                        {VEHICLE_TYPES.map((t) => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {registerError && <div className={styles.error} role="alert">{registerError}</div>}

                  {/* Duplicate warning */}
                  {duplicateDriver && (
                    <div className={styles.duplicateWarning}>
                      <AlertTriangle size={18} />
                      <div className={styles.duplicateContent}>
                        <strong>Driver already exists</strong>
                        <p>
                          <strong>{duplicateDriver.full_name}</strong> — {duplicateDriver.plate_number} — {duplicateDriver.phone_number}
                        </p>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={useDuplicateDriver}
                        >
                          Use Existing Driver
                        </Button>
                      </div>
                    </div>
                  )}

                  <div className={styles.registerActions}>
                    <Button type="submit" variant="primary" loading={registering}>
                      Register & Continue
                    </Button>
                    <Button variant="ghost" onClick={() => setShowRegisterForm(false)}>
                      Cancel
                    </Button>
                  </div>
                </form>
              )}
            </Card>
          )}

          {/* Driver Card */}
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

              {/* Auto-check: Recent paid tickets today */}
              {recentPaidTickets.length > 0 && flowStep === 'search' && (
                <div className={styles.paidAlertSection}>
                  <div className={styles.paidAlert}>
                    <ShieldCheck size={20} />
                    <div>
                      <strong>Driver has already paid today</strong>
                      <p>This driver has {recentPaidTickets.length} paid ticket{recentPaidTickets.length > 1 ? 's' : ''} for today. No further action needed.</p>
                    </div>
                  </div>
                  {recentPaidTickets.map((t) => (
                    <div key={t.id} className={styles.paidTicketRow}>
                      <div className={styles.paidTicketInfo}>
                        <span className={styles.paidTicketNum}>{t.ticket_number}</span>
                        <span className={styles.paidTicketOffence}>{t.offence_description}</span>
                      </div>
                      <div className={styles.paidTicketRight}>
                        <span className={styles.paidTicketAmount}>{formatCurrency(t.fine_amount)}</span>
                        <Badge label="Paid" variant="success" />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Step 1: Issue Ticket */}
              {driver.compliance_status !== 'Compliant' && flowStep === 'search' && recentPaidTickets.length === 0 && (
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
                      {offences.filter((o) => o.is_active).map((o) => (
                        <option key={o.code} value={o.code}>{o.description}</option>
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

              {/* Step 2: Ticket Issued — Payment Instructions */}
              {flowStep === 'ticket-issued' && issuedTicket && (
                <div className={styles.ticketSection}>
                  <div className={styles.successBanner} role="status" aria-live="polite">
                    <CheckCircle size={20} />
                    <span>Ticket <strong>{issuedTicket.ticket_number}</strong> issued successfully</span>
                  </div>

                  <div className={styles.paymentPrompt}>
                    <h3 className={styles.ticketTitle}>
                      <CreditCard size={18} /> Payment Required
                    </h3>
                    <p className={styles.paymentDesc}>
                      Direct the driver to pay <strong>{formatCurrency(issuedTicket.fine_amount)}</strong> to the central government account below:
                    </p>

                    <div className={styles.accountCard}>
                      <div className={styles.accountIcon}>
                        <Building2 size={22} />
                      </div>
                      <div className={styles.accountDetails}>
                        <div className={styles.accountField}>
                          <span className={styles.accountLabel}>Bank</span>
                          <span className={styles.accountValue}>{CENTRAL_ACCOUNT.bank}</span>
                        </div>
                        <div className={styles.accountField}>
                          <span className={styles.accountLabel}>Account Name</span>
                          <span className={styles.accountValue}>{CENTRAL_ACCOUNT.account_name}</span>
                        </div>
                        <div className={styles.accountField}>
                          <span className={styles.accountLabel}>Account Number</span>
                          <div className={styles.accountNumberRow}>
                            <span className={styles.accountNumber}>{CENTRAL_ACCOUNT.account_number}</span>
                            <button className={styles.copyBtn} onClick={handleCopyAccount} type="button">
                              <Copy size={14} />
                              {copied ? 'Copied!' : 'Copy'}
                            </button>
                          </div>
                        </div>
                        <div className={styles.accountField}>
                          <span className={styles.accountLabel}>Payment Reference</span>
                          <span className={styles.accountNumber}>{issuedTicket.payment_reference}</span>
                        </div>
                        <div className={styles.accountField}>
                          <span className={styles.accountLabel}>Amount</span>
                          <span className={styles.accountAmount}>{formatCurrency(issuedTicket.fine_amount)}</span>
                        </div>
                      </div>
                    </div>

                    <Button onClick={handleProceedToPayment} variant="primary">
                      Proceed to Payment Confirmation
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 3: Confirm Payment */}
              {flowStep === 'payment-pending' && issuedTicket && (
                <div className={styles.ticketSection}>
                  <h3 className={styles.ticketTitle}>Confirm Payment</h3>
                  <p className={styles.paymentDesc}>
                    Once the driver has transferred <strong>{formatCurrency(issuedTicket.fine_amount)}</strong> to the central account using reference <strong>{issuedTicket.payment_reference}</strong>, confirm the payment below.
                  </p>

                  <div className={styles.confirmActions}>
                    <Button
                      variant="primary"
                      onClick={handleConfirmPayment}
                      loading={confirming}
                      icon={<CheckCircle size={16} />}
                    >
                      Confirm Payment Received
                    </Button>
                    <Button variant="ghost" onClick={() => setFlowStep('ticket-issued')}>
                      Back
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 4: Receipt with QR Code */}
              {flowStep === 'payment-confirmed' && issuedTicket && driver && (
                <div className={styles.ticketSection}>
                  <div className={styles.successBanner} role="status" aria-live="polite">
                    <CheckCircle size={20} />
                    <span>Payment confirmed. Receipt generated.</span>
                  </div>

                  <div className={styles.receiptCard} ref={receiptRef}>
                    <div className="receipt-header">
                      <h2>Enugu State Ministry of Transportation</h2>
                      <p>Driver Biometric Compliance — Payment Receipt</p>
                    </div>

                    <div className="receipt-badge">PAID</div>

                    <div className="receipt-grid">
                      <div className="receipt-field">
                        <label>Receipt No.</label>
                        <span>{issuedTicket.receipt_number}</span>
                      </div>
                      <div className="receipt-field">
                        <label>Ticket No.</label>
                        <span>{issuedTicket.ticket_number}</span>
                      </div>
                      <div className="receipt-field">
                        <label>Driver Name</label>
                        <span>{driver.full_name}</span>
                      </div>
                      <div className="receipt-field">
                        <label>Plate Number</label>
                        <span>{driver.plate_number}</span>
                      </div>
                      <div className="receipt-field">
                        <label>Vehicle Type</label>
                        <span>{driver.vehicle_type}</span>
                      </div>
                      <div className="receipt-field">
                        <label>Phone</label>
                        <span>{driver.phone_number}</span>
                      </div>
                      <div className="receipt-field">
                        <label>Offence</label>
                        <span>{issuedTicket.offence_description}</span>
                      </div>
                      <div className="receipt-field">
                        <label>Payment Ref.</label>
                        <span>{issuedTicket.payment_reference}</span>
                      </div>
                      <div className="receipt-field">
                        <label>Issued By</label>
                        <span>{issuedTicket.agent_name}</span>
                      </div>
                      <div className="receipt-field">
                        <label>Payment Date</label>
                        <span>{issuedTicket.paid_at ? formatDateTime(issuedTicket.paid_at) : '—'}</span>
                      </div>
                    </div>

                    <div className="receipt-amount">
                      <div className="label">Amount Paid</div>
                      <div className="value">{formatCurrency(issuedTicket.fine_amount)}</div>
                    </div>

                    <div className="receipt-qr">
                      <img src={generateQRDataUrl(qrData)} alt="Payment verification QR code" />
                      <p>Scan to verify payment — {issuedTicket.receipt_number}</p>
                    </div>

                    <div className="receipt-footer">
                      This receipt confirms payment for the above violation. Present this QR code or receipt number to enforcement officers as proof of payment.
                      <br />Enugu State Government &copy; 2026
                    </div>
                  </div>

                  <div className={styles.receiptActions}>
                    <Button onClick={handlePrint} icon={<Printer size={16} />}>
                      Print Receipt
                    </Button>
                    <Button variant="secondary" onClick={resetSearch}>
                      New Search
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          )}
        </div>
      )}

      {/* ── VERIFY RECEIPT TAB ────────────────────────────── */}
      {activeTab === 'verify' && (
        <div className={styles.tabContent}>
          <p className={styles.tabDesc}>
            Enter a receipt number, payment reference, or ticket number to verify a driver's payment.
          </p>

          <form className={styles.searchForm} onSubmit={handleVerifyReceipt}>
            <div className={styles.searchInputWrapper}>
              <QrCode size={16} className={styles.searchIcon} />
              <input
                className={styles.searchInput}
                type="search"
                placeholder="e.g. RCT-20260312-00001 or PAY-20260120-001"
                value={verifyQuery}
                onChange={(e) => setVerifyQuery(e.target.value)}
                aria-label="Enter receipt or ticket number to verify"
              />
            </div>
            <Button type="submit" loading={verifying}>Verify</Button>
          </form>

          {verifyError && <div className={styles.error} role="alert">{verifyError}</div>}

          {verifiedTicket && (
            <div className={styles.verifiedBanner} role="status" aria-live="polite">
              <ShieldCheck size={20} />
              <div className={styles.verifiedContent}>
                <strong>Payment Verified</strong>
                <span>
                  Ticket {verifiedTicket.ticket_number} — {verifiedTicket.plate_number} — {formatCurrency(verifiedTicket.fine_amount)} paid on {verifiedTicket.paid_at ? formatDateTime(verifiedTicket.paid_at) : '—'}
                </span>
                <span className={styles.verifiedReceipt}>Receipt: {verifiedTicket.receipt_number}</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
