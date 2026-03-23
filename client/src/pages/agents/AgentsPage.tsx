import React, { useState, useEffect, useCallback } from 'react';
import { agentService, type AgentStats } from '@/services/agentService';
import { mockTickets } from '@/mock';
import type { User } from '@/types';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { useAuth } from '@/context/AuthContext';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { Modal } from '@/components/ui/Modal';
import { Table, type Column } from '@/components/ui/Table';
import { SearchBar } from '@/components/ui/SearchBar';
import { formatCurrency, formatDateTime } from '@/utils/format';
import {
  UserPlus,
  Eye,
  Edit2,
  Trash2,
  Shield,
  Phone,
  Mail,
  Hash,
  ToggleLeft,
  ToggleRight,
} from 'lucide-react';
import styles from './AgentsPage.module.css';

export const AgentsPage: React.FC = () => {
  useDocumentTitle('Agent Management');
  const { user: currentUser } = useAuth();

  const [agents, setAgents] = useState<User[]>([]);
  const [filteredAgents, setFilteredAgents] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<User | null>(null);
  const [agentStats, setAgentStats] = useState<AgentStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(false);

  // Form states
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formLoading, setFormLoading] = useState(false);

  const fetchAgents = useCallback(async () => {
    setLoading(true);
    try {
      const data = await agentService.getAgents();
      setAgents(data);
    } catch (err) {
      console.error('Failed to fetch agents:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAgents();
  }, [fetchAgents]);

  useEffect(() => {
    if (!search) {
      setFilteredAgents(agents);
      return;
    }
    const q = search.toLowerCase();
    setFilteredAgents(
      agents.filter(
        (a) =>
          a.name.toLowerCase().includes(q) ||
          a.email.toLowerCase().includes(q) ||
          a.phone.toLowerCase().includes(q),
      ),
    );
  }, [agents, search]);

  const handleSearch = (value: string) => {
    setSearch(value);
  };

  // Add Agent
  const openAddModal = () => {
    setFormName('');
    setFormEmail('');
    setFormPhone('');
    setShowAddModal(true);
  };

  const handleCreateAgent = async () => {
    if (!formName.trim()) return;
    setFormLoading(true);
    try {
      await agentService.createAgent({
        name: formName.trim(),
        email: formEmail.trim(),
        phone: formPhone.trim(),
      });
      await fetchAgents();
      setShowAddModal(false);
    } catch (err) {
      console.error('Failed to create agent:', err);
    } finally {
      setFormLoading(false);
    }
  };

  // View Agent Detail
  const openDetailModal = async (agent: User) => {
    setSelectedAgent(agent);
    setAgentStats(null);
    setShowDetailModal(true);
    setStatsLoading(true);
    try {
      const stats = await agentService.getAgentStats(agent.agent_id);
      setAgentStats(stats);
    } catch (err) {
      console.error('Failed to fetch agent stats:', err);
    } finally {
      setStatsLoading(false);
    }
  };

  // Edit Agent
  const openEditModal = () => {
    if (!selectedAgent) return;
    setFormName(selectedAgent.name);
    setFormEmail(selectedAgent.email);
    setFormPhone(selectedAgent.phone);
    setShowDetailModal(false);
    setShowEditModal(true);
  };

  const handleUpdateAgent = async () => {
    if (!selectedAgent || !formName.trim()) return;
    setFormLoading(true);
    try {
      const updated = await agentService.updateAgent(selectedAgent.id, {
        name: formName.trim(),
        email: formEmail.trim(),
        phone: formPhone.trim(),
      });
      setSelectedAgent(updated);
      await fetchAgents();
      setShowEditModal(false);
    } catch (err) {
      console.error('Failed to update agent:', err);
    } finally {
      setFormLoading(false);
    }
  };

  // Toggle Status
  const handleToggleStatus = async () => {
    if (!selectedAgent) return;
    try {
      const updated = await agentService.toggleAgentStatus(selectedAgent.id);
      setSelectedAgent(updated);
      await fetchAgents();
    } catch (err) {
      console.error('Failed to toggle agent status:', err);
    }
  };

  // Delete Agent
  const handleDeleteAgent = async () => {
    if (!selectedAgent) return;
    const confirmed = window.confirm(
      `Are you sure you want to deactivate ${selectedAgent.name}? This will soft-delete the agent.`,
    );
    if (!confirmed) return;
    try {
      await agentService.deleteAgent(selectedAgent.id);
      await fetchAgents();
      setShowDetailModal(false);
      setSelectedAgent(null);
    } catch (err) {
      console.error('Failed to delete agent:', err);
    }
  };

  // Table columns
  const columns: Column<Record<string, unknown>>[] = [
    { key: 'name', header: 'Name' },
    {
      key: 'agent_id',
      header: 'Agent ID',
      render: (row) => <span className={styles.agentId}>{row.agent_id as string}</span>,
    },
    { key: 'email', header: 'Email' },
    { key: 'phone', header: 'Phone' },
    {
      key: 'is_active',
      header: 'Status',
      render: (row) => (
        <Badge
          label={row.is_active ? 'Active' : 'Inactive'}
          variant={row.is_active ? 'success' : 'danger'}
        />
      ),
    },
    {
      key: 'tickets',
      header: 'Tickets',
      render: (row) => <span className={styles.mono}>{row._ticket_count as number}</span>,
    },
    {
      key: 'collected',
      header: 'Collected',
      render: (row) => (
        <span className={styles.mono}>{formatCurrency(row._amount_collected as number)}</span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (row) => (
        <Button
          variant="ghost"
          size="sm"
          icon={<Eye size={14} />}
          onClick={(e) => {
            e.stopPropagation();
            const agent = agents.find((a) => a.id === row.id);
            if (agent) openDetailModal(agent);
          }}
        >
          View
        </Button>
      ),
    },
  ];

  // Compute ticket counts synchronously for table display
  const enrichedTableData = filteredAgents.map((agent) => {
    const agentTickets = mockTickets.filter((t) => t.agent_id === agent.agent_id);
    const collected = agentTickets
      .filter((t) => t.status === 'Paid')
      .reduce((sum, t) => sum + t.fine_amount, 0);
    return {
      ...agent,
      _ticket_count: agentTickets.length,
      _amount_collected: collected,
    } as unknown as Record<string, unknown>;
  });

  // Recent tickets columns for detail modal
  const recentTicketColumns: Column<Record<string, unknown>>[] = [
    { key: 'ticket_number', header: 'Ticket #' },
    { key: 'plate_number', header: 'Plate' },
    { key: 'offence_description', header: 'Offence' },
    {
      key: 'fine_amount',
      header: 'Fine',
      render: (row) => formatCurrency(row.fine_amount as number),
    },
    {
      key: 'status',
      header: 'Status',
      render: (row) => {
        const status = row.status as string;
        const variant =
          status === 'Paid'
            ? 'success'
            : status === 'Unpaid'
              ? 'danger'
              : status === 'Partial Payment'
                ? 'warning'
                : 'neutral';
        return <Badge label={status} variant={variant} />;
      },
    },
    {
      key: 'issued_at',
      header: 'Issued',
      render: (row) => formatDateTime(row.issued_at as string),
    },
  ];

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.pageTitle}>Agent Management</h1>
        <span className={styles.count}>{agents.length} agents</span>
        <div className={styles.addButton}>
          <Button
            variant="primary"
            size="sm"
            icon={<UserPlus size={14} />}
            onClick={openAddModal}
          >
            Add Agent
          </Button>
        </div>
      </div>

      <SearchBar
        placeholder="Search by name, email, or phone..."
        onChange={handleSearch}
        className={styles.search}
      />

      {loading ? (
        <div className={styles.loading}>
          <Spinner size="lg" />
        </div>
      ) : (
        <Table
          columns={columns}
          data={enrichedTableData}
          emptyMessage="No agents found"
        />
      )}

      {/* Add Agent Modal */}
      {showAddModal && (
        <Modal title="Add New Agent" onClose={() => setShowAddModal(false)}>
          <div className={styles.formGroup}>
            <label>Full Name</label>
            <input
              type="text"
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              placeholder="Enter full name"
            />
          </div>
          <div className={styles.formGroup}>
            <label>Email</label>
            <input
              type="email"
              value={formEmail}
              onChange={(e) => setFormEmail(e.target.value)}
              placeholder="e.g. name@mot.gov.ng"
            />
          </div>
          <div className={styles.formGroup}>
            <label>Phone Number</label>
            <input
              type="tel"
              value={formPhone}
              onChange={(e) => setFormPhone(e.target.value)}
              placeholder="e.g. 08012345678"
            />
          </div>
          <div className={styles.formActions}>
            <Button variant="secondary" size="sm" onClick={() => setShowAddModal(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              loading={formLoading}
              onClick={handleCreateAgent}
              disabled={!formName.trim()}
            >
              Create Agent
            </Button>
          </div>
        </Modal>
      )}

      {/* Agent Detail Modal */}
      {showDetailModal && selectedAgent && (
        <Modal
          title="Agent Details"
          onClose={() => {
            setShowDetailModal(false);
            setSelectedAgent(null);
          }}
        >
          <div className={styles.detailGrid}>
            <div className={styles.detailField}>
              <span className={styles.label}>Name</span>
              <span className={styles.value}>{selectedAgent.name}</span>
            </div>
            <div className={styles.detailField}>
              <span className={styles.label}>Agent ID</span>
              <span className={styles.value}>{selectedAgent.agent_id}</span>
            </div>
            <div className={styles.detailField}>
              <span className={styles.label}>Email</span>
              <span className={styles.value}>{selectedAgent.email}</span>
            </div>
            <div className={styles.detailField}>
              <span className={styles.label}>Phone</span>
              <span className={styles.value}>{selectedAgent.phone}</span>
            </div>
            <div className={styles.detailField}>
              <span className={styles.label}>Status</span>
              <span className={styles.value}>
                <Badge
                  label={selectedAgent.is_active ? 'Active' : 'Inactive'}
                  variant={selectedAgent.is_active ? 'success' : 'danger'}
                />
              </span>
            </div>
            <div className={styles.detailField}>
              <span className={styles.label}>Created</span>
              <span className={styles.value}>{formatDateTime(selectedAgent.created_at)}</span>
            </div>
          </div>

          {statsLoading ? (
            <div className={styles.loading}>
              <Spinner size="md" />
            </div>
          ) : agentStats ? (
            <>
              <h4 className={styles.sectionTitle}>Performance</h4>
              <div className={styles.statsGrid}>
                <div className={styles.statItem}>
                  <div className={styles.statValue}>{agentStats.tickets_total}</div>
                  <div className={styles.statLabel}>Total Tickets</div>
                </div>
                <div className={styles.statItem}>
                  <div className={styles.statValue}>
                    {formatCurrency(agentStats.amount_issued)}
                  </div>
                  <div className={styles.statLabel}>Amount Issued</div>
                </div>
                <div className={styles.statItem}>
                  <div className={styles.statValue}>
                    {formatCurrency(agentStats.amount_collected)}
                  </div>
                  <div className={styles.statLabel}>Collected</div>
                </div>
                <div className={styles.statItem}>
                  <div className={styles.statValue}>{agentStats.collection_rate}%</div>
                  <div className={styles.statLabel}>Collection Rate</div>
                </div>
                <div className={styles.statItem}>
                  <div className={styles.statValue}>{agentStats.unpaid_count}</div>
                  <div className={styles.statLabel}>Unpaid Count</div>
                </div>
              </div>

              {agentStats.recent_tickets.length > 0 && (
                <>
                  <h4 className={styles.sectionTitle}>Recent Tickets</h4>
                  <Table
                    columns={recentTicketColumns}
                    data={
                      agentStats.recent_tickets as unknown as Record<string, unknown>[]
                    }
                    emptyMessage="No tickets yet"
                  />
                </>
              )}
            </>
          ) : null}

          <div className={styles.actions}>
            <Button
              variant="secondary"
              size="sm"
              icon={<Edit2 size={14} />}
              onClick={openEditModal}
            >
              Edit
            </Button>
            <Button
              variant="secondary"
              size="sm"
              icon={
                selectedAgent.is_active ? (
                  <ToggleRight size={14} />
                ) : (
                  <ToggleLeft size={14} />
                )
              }
              onClick={handleToggleStatus}
            >
              {selectedAgent.is_active ? 'Deactivate' : 'Activate'}
            </Button>
            <Button
              variant="danger"
              size="sm"
              icon={<Trash2 size={14} />}
              onClick={handleDeleteAgent}
            >
              Delete
            </Button>
          </div>
        </Modal>
      )}

      {/* Edit Agent Modal */}
      {showEditModal && selectedAgent && (
        <Modal
          title="Edit Agent"
          onClose={() => {
            setShowEditModal(false);
            setShowDetailModal(true);
          }}
        >
          <div className={styles.formGroup}>
            <label>Full Name</label>
            <input
              type="text"
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              placeholder="Enter full name"
            />
          </div>
          <div className={styles.formGroup}>
            <label>Email</label>
            <input
              type="email"
              value={formEmail}
              onChange={(e) => setFormEmail(e.target.value)}
              placeholder="e.g. name@mot.gov.ng"
            />
          </div>
          <div className={styles.formGroup}>
            <label>Phone Number</label>
            <input
              type="tel"
              value={formPhone}
              onChange={(e) => setFormPhone(e.target.value)}
              placeholder="e.g. 08012345678"
            />
          </div>
          <div className={styles.formActions}>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                setShowEditModal(false);
                setShowDetailModal(true);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              loading={formLoading}
              onClick={handleUpdateAgent}
              disabled={!formName.trim()}
            >
              Save Changes
            </Button>
          </div>
        </Modal>
      )}
    </div>
  );
};
