// Server-side model interfaces matching client types with DB-specific fields

export type UserRole = 'Admin' | 'Supervisor' | 'Agent' | 'Finance';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  email: string;
  phone: string;
  agent_id: string;
  password_hash: string;
  is_active: boolean;
  created_at: Date;
}

export type VehicleType = 'Car' | 'Bus' | 'Truck' | 'Motorcycle' | 'Tricycle' | 'Other';
export type BiometricStatus = 'Enrolled' | 'Not Enrolled' | 'Pending' | 'Failed';
export type BiodataStatus = 'Complete' | 'Incomplete' | 'Pending Review';
export type ComplianceStatus = 'Compliant' | 'Non-Compliant' | 'Pending Review' | 'Blacklisted';

export interface Driver {
  id: string;
  full_name: string;
  phone_number: string;
  plate_number: string;
  vehicle_type: VehicleType;
  driver_photo: string;
  biometric_status: BiometricStatus;
  biodata_status: BiodataStatus;
  compliance_status: ComplianceStatus;
  enrollment_date: Date | null;
  enrollment_center: string;
  qr_code: string;
  created_at: Date;
  updated_at: Date;
}

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
  issued_at: Date;
  due_date: Date;
  location: string;
  agent_id: string;
  agent_name: string;
  paid_at: Date | null;
  receipt_number: string | null;
}

export interface Offence {
  code: string;
  description: string;
  amount: number;
  escalation_level: number;
  is_active: boolean;
}

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
  paid_at: Date;
  reconciled_at: Date | null;
}

export interface Zone {
  id: string;
  name: string;
  code: string;
  is_active: boolean;
}

export interface AuditLog {
  id: string;
  user_id: string;
  action: string;
  entity_type: string;
  entity_id: string;
  details: Record<string, unknown>;
  ip_address: string;
  created_at: Date;
}
