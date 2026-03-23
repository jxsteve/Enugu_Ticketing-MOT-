import React, { useState, useEffect } from 'react';
import { offenceService } from '@/services/offenceService';
import type { Offence, User } from '@/types';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Spinner } from '@/components/ui/Spinner';
import { Table, type Column } from '@/components/ui/Table';
import { formatCurrency } from '@/utils/format';
import styles from './SettingsPage.module.css';

type TabKey = 'offences' | 'users';

export const SettingsPage: React.FC = () => {
  useDocumentTitle('Settings');
  const [activeTab, setActiveTab] = useState<TabKey>('offences');
  const [offences, setOffences] = useState<Offence[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (activeTab === 'offences') {
          const data = await offenceService.getOffences();
          setOffences(data);
        } else {
          // Load users from mock
          const { mockUsers } = await import('@/mock');
          setUsers(mockUsers.map(({ password: _, ...u }) => u as User));
        }
      } catch (err) {
        console.error('Failed to load settings data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [activeTab]);

  const offenceColumns: Column<Record<string, unknown>>[] = [
    { key: 'code', header: 'Code' },
    { key: 'description', header: 'Description' },
    {
      key: 'amount',
      header: 'Amount',
      render: (row) => formatCurrency(row.amount as number),
    },
    { key: 'escalation_level', header: 'Level' },
    {
      key: 'is_active',
      header: 'Status',
      render: (row) => (
        <Badge
          label={row.is_active ? 'Active' : 'Inactive'}
          variant={row.is_active ? 'success' : 'neutral'}
        />
      ),
    },
  ];

  const userColumns: Column<Record<string, unknown>>[] = [
    { key: 'name', header: 'Name' },
    { key: 'email', header: 'Email' },
    { key: 'role', header: 'Role' },
    { key: 'phone', header: 'Phone' },
    {
      key: 'is_active',
      header: 'Status',
      render: (row) => (
        <Badge
          label={row.is_active ? 'Active' : 'Inactive'}
          variant={row.is_active ? 'success' : 'neutral'}
        />
      ),
    },
  ];

  return (
    <div className={styles.page}>
      <h1 className={styles.pageTitle}>Settings</h1>

      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === 'offences' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('offences')}
        >
          Offence Table
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'users' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('users')}
        >
          Users
        </button>
      </div>

      {loading ? (
        <div className={styles.loading}>
          <Spinner size="lg" />
        </div>
      ) : (
        <Card>
          {activeTab === 'offences' ? (
            <Table
              columns={offenceColumns}
              data={offences as unknown as Record<string, unknown>[]}
              emptyMessage="No offences configured"
            />
          ) : (
            <Table
              columns={userColumns}
              data={users as unknown as Record<string, unknown>[]}
              emptyMessage="No users found"
            />
          )}
        </Card>
      )}
    </div>
  );
};
