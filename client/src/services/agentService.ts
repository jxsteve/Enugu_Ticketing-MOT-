import { mockUsers, mockTickets } from '@/mock';
import type { User, UserRole } from '@/types';

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export interface AgentStats {
  tickets_total: number;
  tickets_this_week: number;
  tickets_today: number;
  amount_issued: number;
  amount_collected: number;
  collection_rate: number;
  unpaid_count: number;
  unpaid_amount: number;
  recent_tickets: {
    ticket_number: string;
    plate_number: string;
    offence_description: string;
    fine_amount: number;
    status: string;
    issued_at: string;
  }[];
}

export const agentService = {
  async getAgents(): Promise<User[]> {
    await delay(250);

    return mockUsers
      .filter((u) => u.role === 'Agent')
      .map(({ password, ...user }) => user as User)
      .sort((a, b) => a.name.localeCompare(b.name));
  },

  async getAgent(id: string): Promise<User> {
    await delay(200);

    const user = mockUsers.find((u) => u.id === id);
    if (!user) {
      throw new Error(`Agent with ID ${id} not found`);
    }
    const { password, ...agent } = user;
    return agent as User;
  },

  async getAgentStats(agentId: string): Promise<AgentStats> {
    await delay(300);

    const agentTickets = mockTickets.filter((t) => t.agent_id === agentId);

    const now = new Date();
    const todayStr = now.toISOString().slice(0, 10);

    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);
    const weekStr = startOfWeek.toISOString();

    const tickets_total = agentTickets.length;
    const tickets_today = agentTickets.filter(
      (t) => t.issued_at.startsWith(todayStr),
    ).length;
    const tickets_this_week = agentTickets.filter(
      (t) => t.issued_at >= weekStr,
    ).length;

    const amount_issued = agentTickets.reduce((sum, t) => sum + t.fine_amount, 0);

    const paidTickets = agentTickets.filter((t) => t.status === 'Paid');
    const amount_collected = paidTickets.reduce((sum, t) => sum + t.fine_amount, 0);

    const collection_rate =
      amount_issued > 0 ? Math.round((amount_collected / amount_issued) * 100) : 0;

    const unpaidTickets = agentTickets.filter(
      (t) => t.status === 'Unpaid' || t.status === 'Partial Payment',
    );
    const unpaid_count = unpaidTickets.length;
    const unpaid_amount = unpaidTickets.reduce((sum, t) => sum + t.fine_amount, 0);

    const recent_tickets = [...agentTickets]
      .sort((a, b) => b.issued_at.localeCompare(a.issued_at))
      .slice(0, 5)
      .map((t) => ({
        ticket_number: t.ticket_number,
        plate_number: t.plate_number,
        offence_description: t.offence_description,
        fine_amount: t.fine_amount,
        status: t.status,
        issued_at: t.issued_at,
      }));

    return {
      tickets_total,
      tickets_this_week,
      tickets_today,
      amount_issued,
      amount_collected,
      collection_rate,
      unpaid_count,
      unpaid_amount,
      recent_tickets,
    };
  },

  async createAgent(data: {
    name: string;
    email: string;
    phone: string;
  }): Promise<User> {
    await delay(300);

    const usrNum = String(mockUsers.length + 1).padStart(3, '0');
    const agtNum = String(
      mockUsers.filter((u) => u.role === 'Agent').length + 1,
    ).padStart(3, '0');

    const emailFromName = data.email ||
      `${data.name.toLowerCase().replace(/\s+/g, '.')}@mot.gov.ng`;

    const newUser = {
      id: `usr-${usrNum}`,
      name: data.name,
      role: 'Agent' as UserRole,
      email: emailFromName,
      password: 'agent123',
      phone: data.phone,
      agent_id: `AGT-${agtNum}`,
      is_active: true,
      created_at: new Date().toISOString(),
    };

    mockUsers.push(newUser);

    const { password, ...agent } = newUser;
    return agent as User;
  },

  async updateAgent(
    id: string,
    data: { name?: string; phone?: string; email?: string; is_active?: boolean },
  ): Promise<User> {
    await delay(250);

    const user = mockUsers.find((u) => u.id === id);
    if (!user) {
      throw new Error(`Agent with ID ${id} not found`);
    }

    if (data.name !== undefined) user.name = data.name;
    if (data.phone !== undefined) user.phone = data.phone;
    if (data.email !== undefined) user.email = data.email;
    if (data.is_active !== undefined) user.is_active = data.is_active;

    const { password, ...agent } = user;
    return agent as User;
  },

  async deleteAgent(id: string): Promise<void> {
    await delay(200);

    const user = mockUsers.find((u) => u.id === id);
    if (!user) {
      throw new Error(`Agent with ID ${id} not found`);
    }
    user.is_active = false;
  },

  async toggleAgentStatus(id: string): Promise<User> {
    await delay(200);

    const user = mockUsers.find((u) => u.id === id);
    if (!user) {
      throw new Error(`Agent with ID ${id} not found`);
    }
    user.is_active = !user.is_active;

    const { password, ...agent } = user;
    return agent as User;
  },
};
