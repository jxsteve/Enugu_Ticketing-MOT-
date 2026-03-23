export type PaymentChannel = 'Bank Transfer' | 'USSD' | 'Card' | 'POS';
export type PaymentStatus = 'Pending' | 'Confirmed' | 'Failed';

export interface Payment {
  id: string;
  ticket_id: string;
  payment_reference: string;
  gateway_reference: string;
  amount_paid: number;
  channel: PaymentChannel;
  status: PaymentStatus;
  receipt_number: string | null;
  paid_at: string;
  reconciled_at: string | null;
}
