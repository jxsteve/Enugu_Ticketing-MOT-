import type { Payment } from '@/types';
import { mockPayments } from '@/mock';

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const paymentService = {
  async getPayments(ticketId?: string): Promise<Payment[]> {
    await delay(250);

    if (ticketId) {
      return mockPayments.filter((p) => p.ticket_id === ticketId).map((p) => ({ ...p }));
    }

    return mockPayments.map((p) => ({ ...p }));
  },
};
