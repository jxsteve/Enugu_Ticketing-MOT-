import type { VehicleType, ComplianceStatus, TicketStatus, UserRole } from '@/types';

export const VEHICLE_TYPES: VehicleType[] = [
  'Car',
  'Bus',
  'Truck',
  'Motorcycle',
  'Tricycle',
  'Other',
];

export const COMPLIANCE_STATUSES: ComplianceStatus[] = [
  'Compliant',
  'Non-Compliant',
  'Pending Review',
  'Blacklisted',
];

export const TICKET_STATUSES: TicketStatus[] = [
  'Unpaid',
  'Partial Payment',
  'Paid',
  'Cancelled',
  'Waived',
];

export const ROLES: UserRole[] = ['Admin', 'Supervisor', 'Agent', 'Finance'];

export const PAGE_SIZES: number[] = [10, 25, 50, 100];
