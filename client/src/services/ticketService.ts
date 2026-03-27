import type { Ticket, TicketStatus, PaginatedResponse } from '@/types';
import { mockTickets } from '@/mock';

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export interface TicketFilters {
  page?: number;
  pageSize?: number;
  status?: TicketStatus;
  agent_id?: string;
  driver_id?: string;
  offence_code?: string;
  date_from?: string;
  date_to?: string;
  search?: string;
}

export const ticketService = {
  async getTickets(filters: TicketFilters = {}): Promise<PaginatedResponse<Ticket>> {
    await delay(350);

    const {
      page = 1,
      pageSize = 10,
      status,
      agent_id,
      driver_id,
      offence_code,
      date_from,
      date_to,
      search,
    } = filters;

    let filtered = [...mockTickets];

    if (status) {
      filtered = filtered.filter((t) => t.status === status);
    }
    if (agent_id) {
      filtered = filtered.filter((t) => t.agent_id === agent_id);
    }
    if (driver_id) {
      filtered = filtered.filter((t) => t.driver_id === driver_id);
    }
    if (offence_code) {
      filtered = filtered.filter((t) => t.offence_code === offence_code);
    }
    if (date_from) {
      filtered = filtered.filter((t) => t.issued_at >= date_from);
    }
    if (date_to) {
      filtered = filtered.filter((t) => t.issued_at <= date_to);
    }
    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        (t) =>
          t.ticket_number.toLowerCase().includes(q) ||
          t.plate_number.toLowerCase().includes(q) ||
          t.agent_name.toLowerCase().includes(q),
      );
    }

    const total = filtered.length;
    const totalPages = Math.ceil(total / pageSize);
    const start = (page - 1) * pageSize;
    const data = filtered.slice(start, start + pageSize);

    return {
      data,
      total,
      page,
      page_size: pageSize,
      total_pages: totalPages,
    };
  },

  async getTicket(id: string): Promise<Ticket> {
    await delay(250);

    const ticket = mockTickets.find((t) => t.id === id);
    if (!ticket) {
      throw new Error(`Ticket with ID ${id} not found`);
    }
    return { ...ticket };
  },

  async createTicket(data: {
    driver_id: string;
    plate_number: string;
    offence_code: string;
    offence_description: string;
    fine_amount: number;
    location: string;
    agent_id: string;
    agent_name: string;
  }): Promise<Ticket> {
    await delay(400);

    const now = new Date();
    const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
    const seq = String(mockTickets.length + 1).padStart(5, '0');

    const newTicket: Ticket = {
      id: `tkt-${String(mockTickets.length + 1).padStart(3, '0')}`,
      ticket_number: `TKT-${dateStr}-${seq}`,
      driver_id: data.driver_id,
      plate_number: data.plate_number,
      offence_code: data.offence_code,
      offence_description: data.offence_description,
      fine_amount: data.fine_amount,
      status: 'Unpaid',
      payment_reference: `PAY-${dateStr}-${seq}`,
      issued_at: now.toISOString(),
      due_date: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      location: data.location,
      agent_id: data.agent_id,
      agent_name: data.agent_name,
      paid_at: null,
      receipt_number: null,
    };

    mockTickets.push(newTicket);
    return { ...newTicket };
  },

  async confirmPayment(ticketId: string): Promise<Ticket> {
    await delay(500);

    const ticket = mockTickets.find((t) => t.id === ticketId);
    if (!ticket) throw new Error('Ticket not found');

    const now = new Date();
    const seq = String(Math.floor(Math.random() * 99999)).padStart(5, '0');

    ticket.status = 'Paid';
    ticket.paid_at = now.toISOString();
    ticket.receipt_number = `RCT-${now.toISOString().slice(0, 10).replace(/-/g, '')}-${seq}`;

    return { ...ticket };
  },

  async getRecentPaidTickets(driverId: string): Promise<Ticket[]> {
    await delay(150);

    const today = new Date().toISOString().slice(0, 10);
    return mockTickets.filter(
      (t) =>
        t.driver_id === driverId &&
        t.status === 'Paid' &&
        t.paid_at &&
        t.paid_at.startsWith(today),
    );
  },

  async verifyReceipt(receiptNumber: string): Promise<Ticket | null> {
    await delay(200);

    const ticket = mockTickets.find(
      (t) =>
        (t.receipt_number && t.receipt_number.toLowerCase() === receiptNumber.toLowerCase()) ||
        (t.payment_reference && t.payment_reference.toLowerCase() === receiptNumber.toLowerCase()) ||
        t.ticket_number.toLowerCase() === receiptNumber.toLowerCase(),
    );

    return ticket ? { ...ticket } : null;
  },
};
