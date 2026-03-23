export type TicketStatus = 'Unpaid' | 'Partial Payment' | 'Paid' | 'Cancelled' | 'Waived';

export interface Ticket {
  id: string;
  ticket_number: string;
  driver_id: string;
  plate_number: string;
  offence_code: string;
  offence_description: string;
  fine_amount: number;
  status: TicketStatus;
  payment_reference: string;
  issued_at: string;
  due_date: string;
  location: string;
  agent_id: string;
  agent_name: string;
  paid_at: string | null;
  receipt_number: string | null;
}
