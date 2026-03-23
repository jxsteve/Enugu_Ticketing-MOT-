import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  ShieldCheck,
  ShieldAlert,
  Clock,
  FileText,
  Banknote,
  Wallet,
  CalendarDays,
  TrendingUp,
  TrendingDown,
  Eye,
  Shield,
  AlertTriangle,
} from 'lucide-react';
import { dashboardService } from '@/services/dashboardService';
import type { DashboardStats, AgentDashboardStats, AgentActivity } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { Card } from '@/components/ui/Card';
import { Spinner } from '@/components/ui/Spinner';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Table, type Column } from '@/components/ui/Table';
import { formatCurrency, formatDateTime } from '@/utils/format';
import { ComplianceDonutChart } from '@/components/charts/ComplianceDonutChart';
import { RevenueByZoneChart } from '@/components/charts/RevenueByZoneChart';
import { getTicketStatusBadgeVariant } from '@/utils/status';
import styles from './DashboardPage.module.css';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  color?: string;
  trend?: 'up' | 'down' | 'neutral';
  delay?: number;
}

function StatCard({ label, value, icon, color, trend, delay = 0 }: StatCardProps) {
  return (
    <div className={styles.statCard} style={{ animationDelay: `${delay}ms` }}>
      <div className={styles.statTop}>
        <div className={styles.statIconWrapper} style={{ color: color || 'var(--muted-foreground)' }}>
          {icon}
        </div>
        {trend && trend !== 'neutral' && (
          <div className={`${styles.trend} ${styles[trend]}`}>
            {trend === 'up' ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
          </div>
        )}
      </div>
      <div className={styles.statValue} style={{ color: color || 'var(--foreground)' }}>
        {value}
      </div>
      <div className={styles.statLabel}>{label}</div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   AGENT DASHBOARD
   ───────────────────────────────────────────────────────────── */
function AgentDashboard({ user }: { user: { name: string; agent_id: string } }) {
  const navigate = useNavigate();
  const [stats, setStats] = useState<AgentDashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dashboardService
      .getAgentDashboardStats(user.agent_id)
      .then(setStats)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user.agent_id]);

  if (loading) {
    return <div className={styles.loading}><Spinner size="lg" /></div>;
  }

  if (!stats) {
    return <div className={styles.error}>Failed to load dashboard data.</div>;
  }

  const ticketColumns: Column<Record<string, unknown>>[] = [
    {
      key: 'ticket_number',
      header: 'Ticket',
      render: (row) => (
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)' }}>
          {row.ticket_number as string}
        </span>
      ),
    },
    { key: 'plate_number', header: 'Plate' },
    { key: 'offence', header: 'Offence' },
    {
      key: 'amount',
      header: 'Amount',
      render: (row) => (
        <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
          {formatCurrency(row.amount as number)}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (row) => (
        <Badge
          label={row.status as string}
          variant={getTicketStatusBadgeVariant(row.status as string)}
        />
      ),
    },
    {
      key: 'issued_at',
      header: 'Date',
      render: (row) => formatDateTime(row.issued_at as string),
    },
  ];

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Welcome, {user.name.split(' ')[0]}</h1>
        <p className={styles.pageSubtitle}>Your enforcement activity overview</p>
      </div>

      {/* CTA — Check Compliance */}
      <div className={styles.ctaBanner} onClick={() => navigate('/enforcement')}>
        <div className={styles.ctaIcon}>
          <Shield size={24} />
        </div>
        <div className={styles.ctaContent}>
          <h3 className={styles.ctaTitle}>Check Driver Compliance</h3>
          <p className={styles.ctaDesc}>Search a driver by plate number and verify their biometric status</p>
        </div>
        <Button variant="primary" onClick={() => navigate('/enforcement')}>
          Start Check
        </Button>
      </div>

      {/* My Stats */}
      <div className={styles.sectionLabel}>My Activity</div>
      <div className={styles.statsGrid}>
        <StatCard
          label="Tickets Today"
          value={stats.my_tickets_today}
          icon={<FileText size={15} strokeWidth={1.8} />}
          delay={0}
        />
        <StatCard
          label="This Week"
          value={stats.my_tickets_this_week}
          icon={<CalendarDays size={15} strokeWidth={1.8} />}
          delay={50}
        />
        <StatCard
          label="Total Issued"
          value={stats.my_tickets_total}
          icon={<Banknote size={15} strokeWidth={1.8} />}
          delay={100}
        />
        <StatCard
          label="Collected"
          value={formatCurrency(stats.my_amount_collected)}
          icon={<Wallet size={15} strokeWidth={1.8} />}
          color="var(--color-success)"
          trend="up"
          delay={150}
        />
      </div>

      {/* Unpaid Alert */}
      {stats.my_unpaid_count > 0 && (
        <div className={styles.alertBanner}>
          <AlertTriangle size={18} />
          <span>
            You have <strong>{stats.my_unpaid_count}</strong> unpaid ticket{stats.my_unpaid_count > 1 ? 's' : ''} totaling{' '}
            <strong>{formatCurrency(stats.my_unpaid_amount)}</strong> pending collection.
          </span>
        </div>
      )}

      {/* Recent Tickets */}
      <div className={styles.sectionLabel}>Recent Tickets</div>
      <Card title="My Recent Tickets">
        <Table
          columns={ticketColumns}
          data={stats.recent_tickets as unknown as Record<string, unknown>[]}
          emptyMessage="No tickets issued yet"
        />
      </Card>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   ADMIN DASHBOARD
   ───────────────────────────────────────────────────────────── */
function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedAgent, setSelectedAgent] = useState<AgentActivity | null>(null);

  useEffect(() => {
    dashboardService
      .getDashboardStats()
      .then(setStats)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className={styles.loading}><Spinner size="lg" /></div>;
  }

  if (!stats) {
    return <div className={styles.error}>Failed to load dashboard data.</div>;
  }

  const agentColumns: Column<Record<string, unknown>>[] = [
    { key: 'agent_name', header: 'Agent' },
    { key: 'tickets_total', header: 'Total Tickets' },
    {
      key: 'amount_issued',
      header: 'Issued',
      render: (row) => formatCurrency(row.amount_issued as number),
    },
    {
      key: 'amount_collected',
      header: 'Collected',
      render: (row) => (
        <span style={{ color: 'var(--color-success)', fontWeight: 600, fontFamily: 'var(--font-mono)' }}>
          {formatCurrency(row.amount_collected as number)}
        </span>
      ),
    },
    {
      key: 'collection_rate',
      header: 'Rate',
      render: (row) => {
        const rate = row.collection_rate as number;
        const variant = rate >= 50 ? 'success' : rate >= 25 ? 'warning' : 'danger';
        return <Badge label={`${rate}%`} variant={variant} />;
      },
    },
    {
      key: 'last_active',
      header: 'Last Active',
      render: (row) => formatDateTime(row.last_active as string),
    },
    {
      key: 'actions',
      header: '',
      render: (row) => (
        <button
          onClick={() => setSelectedAgent(
            stats.agents.find((a) => a.agent_id === row.agent_id) || null
          )}
          style={{
            background: 'none',
            border: '1px solid var(--border)',
            color: 'var(--muted-foreground)',
            cursor: 'pointer',
            padding: '4px 8px',
            borderRadius: 'var(--radius-md)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            fontSize: 'var(--text-xs)',
            fontFamily: 'var(--font-sans)',
            transition: 'all 150ms ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'var(--primary)';
            e.currentTarget.style.color = 'var(--primary)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'var(--border)';
            e.currentTarget.style.color = 'var(--muted-foreground)';
          }}
        >
          <Eye size={13} /> View
        </button>
      ),
    },
  ];

  const collectionColumns: Column<Record<string, unknown>>[] = [
    { key: 'ticket_number', header: 'Ticket' },
    { key: 'agent_name', header: 'Agent' },
    { key: 'plate_number', header: 'Plate' },
    {
      key: 'amount',
      header: 'Amount',
      render: (row) => (
        <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
          {formatCurrency(row.amount as number)}
        </span>
      ),
    },
    {
      key: 'collected_at',
      header: 'Collected',
      render: (row) => formatDateTime(row.collected_at as string),
    },
    { key: 'location', header: 'Location' },
  ];

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Dashboard</h1>
        <p className={styles.pageSubtitle}>Real-time enforcement overview</p>
      </div>

      {/* Compliance Stats */}
      <div className={styles.sectionLabel}>Compliance</div>
      <div className={styles.statsGrid}>
        <StatCard
          label="Total Drivers"
          value={stats.compliance.total_drivers}
          icon={<Users size={15} strokeWidth={1.8} />}
          delay={0}
        />
        <StatCard
          label="Compliant"
          value={stats.compliance.compliant}
          icon={<ShieldCheck size={15} strokeWidth={1.8} />}
          color="var(--color-success)"
          trend="up"
          delay={50}
        />
        <StatCard
          label="Non-Compliant"
          value={stats.compliance.non_compliant}
          icon={<ShieldAlert size={15} strokeWidth={1.8} />}
          color="var(--color-danger)"
          trend="down"
          delay={100}
        />
        <StatCard
          label="Pending Review"
          value={stats.compliance.pending}
          icon={<Clock size={15} strokeWidth={1.8} />}
          color="var(--color-warning)"
          delay={150}
        />
      </div>

      {/* Enforcement Metrics */}
      <div className={styles.sectionLabel}>Enforcement</div>
      <div className={styles.statsGrid}>
        <StatCard
          label="Tickets Today"
          value={stats.enforcement.tickets_today}
          icon={<FileText size={15} strokeWidth={1.8} />}
          delay={0}
        />
        <StatCard
          label="Issued Today"
          value={formatCurrency(stats.enforcement.amount_issued_today)}
          icon={<Banknote size={15} strokeWidth={1.8} />}
          delay={50}
        />
        <StatCard
          label="Collected Today"
          value={formatCurrency(stats.enforcement.amount_collected_today)}
          icon={<Wallet size={15} strokeWidth={1.8} />}
          color="var(--color-success)"
          trend="up"
          delay={100}
        />
        <StatCard
          label="Tickets This Week"
          value={stats.enforcement.tickets_this_week}
          icon={<CalendarDays size={15} strokeWidth={1.8} />}
          delay={150}
        />
      </div>

      {/* Charts */}
      <div className={styles.sectionLabel}>Analytics</div>
      <div className={styles.chartsGrid}>
        <Card title="Compliance Overview">
          <ComplianceDonutChart data={stats.compliance} />
        </Card>
        <Card title="Revenue by Zone">
          <RevenueByZoneChart data={stats.revenue_by_zone} />
        </Card>
      </div>

      {/* Agent Collections */}
      <div className={styles.sectionLabel}>Agent Collections</div>
      <Card title="Agent Performance & Collections">
        <Table
          columns={agentColumns}
          data={stats.agents as unknown as Record<string, unknown>[]}
          emptyMessage="No agent activity"
        />
      </Card>

      <div className={styles.sectionLabel}>Recent Collections</div>
      <Card title="Payment Collection Log">
        <Table
          columns={collectionColumns}
          data={stats.agent_collections as unknown as Record<string, unknown>[]}
          emptyMessage="No collections recorded"
        />
      </Card>

      {/* Agent Detail Modal */}
      {selectedAgent && (
        <Modal
          title={`Agent: ${selectedAgent.agent_name}`}
          onClose={() => setSelectedAgent(null)}
        >
          <div className={styles.agentDetail}>
            <div className={styles.agentDetailGrid}>
              <div className={styles.agentField}>
                <span className={styles.agentFieldLabel}>Agent ID</span>
                <span className={styles.agentFieldValue}>{selectedAgent.agent_id}</span>
              </div>
              <div className={styles.agentField}>
                <span className={styles.agentFieldLabel}>Total Tickets</span>
                <span className={styles.agentFieldValue}>{selectedAgent.tickets_total}</span>
              </div>
              <div className={styles.agentField}>
                <span className={styles.agentFieldLabel}>Amount Issued</span>
                <span className={styles.agentFieldValue}>{formatCurrency(selectedAgent.amount_issued)}</span>
              </div>
              <div className={styles.agentField}>
                <span className={styles.agentFieldLabel}>Amount Collected</span>
                <span className={styles.agentFieldValue} style={{ color: 'var(--color-success)' }}>
                  {formatCurrency(selectedAgent.amount_collected)}
                </span>
              </div>
              <div className={styles.agentField}>
                <span className={styles.agentFieldLabel}>Collection Rate</span>
                <span className={styles.agentFieldValue}>{selectedAgent.collection_rate}%</span>
              </div>
              <div className={styles.agentField}>
                <span className={styles.agentFieldLabel}>Last Active</span>
                <span className={styles.agentFieldValue}>{formatDateTime(selectedAgent.last_active)}</span>
              </div>
            </div>

            <h4 style={{ margin: 'var(--space-6) 0 var(--space-3)', fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)' }}>
              Collections by this agent
            </h4>
            <Table
              columns={[
                { key: 'ticket_number', header: 'Ticket' },
                { key: 'plate_number', header: 'Plate' },
                {
                  key: 'amount',
                  header: 'Amount',
                  render: (row) => formatCurrency(row.amount as number),
                },
                {
                  key: 'collected_at',
                  header: 'Date',
                  render: (row) => formatDateTime(row.collected_at as string),
                },
              ]}
              data={
                stats.agent_collections
                  .filter((c) => c.agent_id === selectedAgent.agent_id) as unknown as Record<string, unknown>[]
              }
              emptyMessage="No collections"
            />
          </div>
        </Modal>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   MAIN EXPORT — Routes to correct dashboard by role
   ───────────────────────────────────────────────────────────── */
export const DashboardPage: React.FC = () => {
  useDocumentTitle('Dashboard');
  const { user } = useAuth();

  if (!user) return null;

  if (user.role === 'Agent') {
    return <AgentDashboard user={user} />;
  }

  return <AdminDashboard />;
};
