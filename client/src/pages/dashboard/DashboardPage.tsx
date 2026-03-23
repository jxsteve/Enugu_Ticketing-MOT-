import React, { useState, useEffect } from 'react';
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
} from 'lucide-react';
import { dashboardService } from '@/services/dashboardService';
import type { DashboardStats } from '@/types';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { Card } from '@/components/ui/Card';
import { Spinner } from '@/components/ui/Spinner';
import { Table, type Column } from '@/components/ui/Table';
import { formatCurrency, formatDateTime } from '@/utils/format';
import { ComplianceDonutChart } from '@/components/charts/ComplianceDonutChart';
import { RevenueByZoneChart } from '@/components/charts/RevenueByZoneChart';
import { UnpaidAgingChart } from '@/components/charts/UnpaidAgingChart';
import { EnforcementTrendChart } from '@/components/charts/EnforcementTrendChart';
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

export const DashboardPage: React.FC = () => {
  useDocumentTitle('Dashboard');
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dashboardService
      .getDashboardStats()
      .then(setStats)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className={styles.loading}>
        <Spinner size="lg" />
      </div>
    );
  }

  if (!stats) {
    return <div className={styles.error}>Failed to load dashboard data.</div>;
  }

  const agentColumns: Column<Record<string, unknown>>[] = [
    { key: 'agent_name', header: 'Agent' },
    { key: 'tickets_today', header: 'Today' },
    { key: 'tickets_this_week', header: 'This Week' },
    {
      key: 'last_active',
      header: 'Last Active',
      render: (row) => formatDateTime(row.last_active as string),
    },
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
          icon={<Users size={18} strokeWidth={1.8} />}
          delay={0}
        />
        <StatCard
          label="Compliant"
          value={stats.compliance.compliant}
          icon={<ShieldCheck size={18} strokeWidth={1.8} />}
          color="var(--color-success)"
          trend="up"
          delay={50}
        />
        <StatCard
          label="Non-Compliant"
          value={stats.compliance.non_compliant}
          icon={<ShieldAlert size={18} strokeWidth={1.8} />}
          color="var(--color-danger)"
          trend="down"
          delay={100}
        />
        <StatCard
          label="Pending Review"
          value={stats.compliance.pending}
          icon={<Clock size={18} strokeWidth={1.8} />}
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
          icon={<FileText size={18} strokeWidth={1.8} />}
          delay={0}
        />
        <StatCard
          label="Issued Today"
          value={formatCurrency(stats.enforcement.amount_issued_today)}
          icon={<Banknote size={18} strokeWidth={1.8} />}
          delay={50}
        />
        <StatCard
          label="Collected Today"
          value={formatCurrency(stats.enforcement.amount_collected_today)}
          icon={<Wallet size={18} strokeWidth={1.8} />}
          color="var(--color-success)"
          trend="up"
          delay={100}
        />
        <StatCard
          label="Tickets This Week"
          value={stats.enforcement.tickets_this_week}
          icon={<CalendarDays size={18} strokeWidth={1.8} />}
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
        <Card title="Unpaid Aging">
          <UnpaidAgingChart data={stats.unpaid_aging} />
        </Card>
        <Card title="Enforcement Trend">
          <EnforcementTrendChart />
        </Card>
      </div>

      {/* Agent Activity */}
      <div className={styles.sectionLabel}>Team Activity</div>
      <Card title="Agent Activity">
        <Table
          columns={agentColumns}
          data={stats.agents as unknown as Record<string, unknown>[]}
          emptyMessage="No agent activity"
        />
      </Card>
    </div>
  );
};
