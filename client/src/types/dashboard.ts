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
  last_active: string;
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

export interface DashboardStats {
  compliance: ComplianceOverview;
  enforcement: EnforcementMetrics;
  agents: AgentActivity[];
  revenue_by_zone: RevenueByZone[];
  unpaid_aging: UnpaidAging[];
}
