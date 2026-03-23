import React, { useState, useEffect } from 'react';
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
      <h1 className={styles.pageTitle}>Dashboard</h1>

      {/* Stat Cards */}
      <div className={styles.statsGrid}>
        <Card className={styles.statCard}>
          <div className={styles.statLabel}>Total Drivers</div>
          <div className={styles.statValue}>{stats.compliance.total_drivers}</div>
        </Card>
        <Card className={styles.statCard}>
          <div className={styles.statLabel}>Compliant</div>
          <div className={styles.statValue} style={{ color: 'var(--color-success)' }}>
            {stats.compliance.compliant}
          </div>
        </Card>
        <Card className={styles.statCard}>
          <div className={styles.statLabel}>Non-Compliant</div>
          <div className={styles.statValue} style={{ color: 'var(--color-danger)' }}>
            {stats.compliance.non_compliant}
          </div>
        </Card>
        <Card className={styles.statCard}>
          <div className={styles.statLabel}>Pending Review</div>
          <div className={styles.statValue} style={{ color: 'var(--color-warning)' }}>
            {stats.compliance.pending}
          </div>
        </Card>
      </div>

      {/* Enforcement Metrics */}
      <div className={styles.metricsGrid}>
        <Card className={styles.statCard}>
          <div className={styles.statLabel}>Tickets Today</div>
          <div className={styles.statValue}>{stats.enforcement.tickets_today}</div>
        </Card>
        <Card className={styles.statCard}>
          <div className={styles.statLabel}>Issued Today</div>
          <div className={styles.statValue}>{formatCurrency(stats.enforcement.amount_issued_today)}</div>
        </Card>
        <Card className={styles.statCard}>
          <div className={styles.statLabel}>Collected Today</div>
          <div className={styles.statValue} style={{ color: 'var(--color-success)' }}>
            {formatCurrency(stats.enforcement.amount_collected_today)}
          </div>
        </Card>
        <Card className={styles.statCard}>
          <div className={styles.statLabel}>Tickets This Week</div>
          <div className={styles.statValue}>{stats.enforcement.tickets_this_week}</div>
        </Card>
      </div>

      {/* Charts */}
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
