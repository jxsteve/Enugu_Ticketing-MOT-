import type { Offence } from '@/types';

export const mockOffences: Offence[] = [
  {
    code: 'BIO-001',
    description: 'Failure to complete biometric enrollment',
    amount: 10000,
    escalation_level: 1,
    is_active: true,
  },
  {
    code: 'BIO-002',
    description: 'Expired biometric compliance (>12mo)',
    amount: 5000,
    escalation_level: 1,
    is_active: true,
  },
  {
    code: 'BIO-003',
    description: 'Repeat non-compliance (2nd)',
    amount: 20000,
    escalation_level: 2,
    is_active: true,
  },
  {
    code: 'BIO-004',
    description: 'Repeat non-compliance (3rd+)',
    amount: 50000,
    escalation_level: 3,
    is_active: true,
  },
  {
    code: 'BIO-005',
    description: 'Fraudulent compliance documents',
    amount: 100000,
    escalation_level: 4,
    is_active: true,
  },
];
