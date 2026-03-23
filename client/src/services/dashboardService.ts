import type { DashboardStats } from '@/types';
import { mockDrivers, mockTickets, mockUsers } from '@/mock';

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const dashboardService = {
  async getDashboardStats(): Promise<DashboardStats> {
    await delay(400);

    const today = new Date().toISOString().slice(0, 10);
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

    // Compliance overview
    const compliance = {
      total_drivers: mockDrivers.length,
      compliant: mockDrivers.filter((d) => d.compliance_status === 'Compliant').length,
      non_compliant: mockDrivers.filter((d) => d.compliance_status === 'Non-Compliant').length,
      pending: mockDrivers.filter((d) => d.compliance_status === 'Pending Review').length,
      blacklisted: mockDrivers.filter((d) => d.compliance_status === 'Blacklisted').length,
    };

    // Enforcement metrics
    const ticketsToday = mockTickets.filter((t) => t.issued_at.startsWith(today));
    const ticketsThisWeek = mockTickets.filter((t) => t.issued_at >= weekAgo);

    const enforcement = {
      tickets_today: ticketsToday.length,
      amount_issued_today: ticketsToday.reduce((sum, t) => sum + t.fine_amount, 0),
      amount_collected_today: ticketsToday
        .filter((t) => t.status === 'Paid')
        .reduce((sum, t) => sum + t.fine_amount, 0),
      tickets_this_week: ticketsThisWeek.length,
    };

    // Agent activity
    const agentUsers = mockUsers.filter((u) => u.role === 'Agent');
    const agents = agentUsers.map((agent) => {
      const agentTicketsToday = ticketsToday.filter((t) => t.agent_id === agent.agent_id);
      const agentTicketsWeek = ticketsThisWeek.filter((t) => t.agent_id === agent.agent_id);
      const lastTicket = mockTickets
        .filter((t) => t.agent_id === agent.agent_id)
        .sort((a, b) => b.issued_at.localeCompare(a.issued_at))[0];

      return {
        agent_id: agent.agent_id,
        agent_name: agent.name,
        tickets_today: agentTicketsToday.length,
        tickets_this_week: agentTicketsWeek.length,
        last_active: lastTicket?.issued_at || agent.created_at,
      };
    });

    // Revenue by zone
    const zones = ['Enugu North', 'Enugu South', 'Enugu East', 'Nsukka', 'Udi', 'Nkanu West', 'Igbo-Eze North', 'Aninri'];
    const revenue_by_zone = zones.map((zone) => {
      const zoneTickets = mockTickets.filter((t) => t.location === zone);
      return {
        zone,
        amount_issued: zoneTickets.reduce((sum, t) => sum + t.fine_amount, 0),
        amount_collected: zoneTickets
          .filter((t) => t.status === 'Paid')
          .reduce((sum, t) => sum + t.fine_amount, 0),
      };
    });

    // Unpaid aging
    const now = Date.now();
    const unpaidTickets = mockTickets.filter(
      (t) => t.status === 'Unpaid' || t.status === 'Partial Payment',
    );

    const agingBuckets = [
      { range: '0-7 days', min: 0, max: 7 },
      { range: '8-14 days', min: 8, max: 14 },
      { range: '15-30 days', min: 15, max: 30 },
      { range: '31-60 days', min: 31, max: 60 },
      { range: '60+ days', min: 61, max: Infinity },
    ];

    const unpaid_aging = agingBuckets.map(({ range, min, max }) => {
      const bucket = unpaidTickets.filter((t) => {
        const daysOld = Math.floor((now - new Date(t.issued_at).getTime()) / (24 * 60 * 60 * 1000));
        return daysOld >= min && daysOld <= max;
      });
      return {
        range,
        count: bucket.length,
        amount: bucket.reduce((sum, t) => sum + t.fine_amount, 0),
      };
    });

    return {
      compliance,
      enforcement,
      agents,
      revenue_by_zone,
      unpaid_aging,
    };
  },
};
