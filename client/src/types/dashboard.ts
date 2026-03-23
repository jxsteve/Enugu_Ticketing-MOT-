export interface ComplianceOverview {
  total_drivers: number;
  compliant: number;
  non_compliant: number;
  pending: number;
  blacklisted: number;
}

export interface EnforcementMetrics {
  tickets_today: number;
  amount_issued_today: number;
  amount_collected_today: number;
  tickets_this_week: number;
}

export interface AgentActivity {
  agent_id: string;
  agent_name: string;
  tickets_today: number;
  tickets_this_week: number;
  tickets_total: number;
  amount_issued: number;
  amount_collected: number;
  collection_rate: number;
  last_active: string;
}

export interface AgentCollection {
  ticket_number: string;
  agent_name: string;
  agent_id: string;
  plate_number: string;
  amount: number;
  collected_at: string;
  location: string;
}

export interface RevenueByZone {
  zone: string;
  amount_issued: number;
  amount_collected: number;
}

export interface UnpaidAging {
  range: string;
  count: number;
  amount: number;
}

export interface AgentDashboardStats {
  my_tickets_today: number;
  my_tickets_this_week: number;
  my_tickets_total: number;
  my_amount_issued: number;
  my_amount_collected: number;
  my_unpaid_count: number;
  my_unpaid_amount: number;
  recent_tickets: {
    ticket_number: string;
    plate_number: string;
    offence: string;
    amount: number;
    status: string;
    issued_at: string;
  }[];
}

export interface DashboardStats {
  compliance: ComplianceOverview;
  enforcement: EnforcementMetrics;
  agents: AgentActivity[];
  agent_collections: AgentCollection[];
  revenue_by_zone: RevenueByZone[];
  unpaid_aging: UnpaidAging[];
}
