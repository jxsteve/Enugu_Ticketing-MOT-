import type { ComplianceStatus, TicketStatus } from '@/types';

export function getComplianceColor(status: ComplianceStatus): string {
  switch (status) {
    case 'Compliant':
      return 'var(--color-success)';
    case 'Non-Compliant':
      return 'var(--color-danger)';
    case 'Pending Review':
      return 'var(--color-warning)';
    case 'Blacklisted':
      return '#7C3AED';
    default:
      return 'var(--color-text-muted)';
  }
}

export function getTicketStatusColor(status: TicketStatus): string {
  switch (status) {
    case 'Paid':
      return 'var(--color-success)';
    case 'Unpaid':
      return 'var(--color-danger)';
    case 'Partial Payment':
      return 'var(--color-warning)';
    case 'Cancelled':
      return 'var(--color-text-muted)';
    case 'Waived':
      return 'var(--color-info)';
    default:
      return 'var(--color-text-muted)';
  }
}

export function getComplianceBadgeVariant(
  status: ComplianceStatus,
): 'success' | 'warning' | 'danger' | 'info' | 'neutral' {
  switch (status) {
    case 'Compliant':
      return 'success';
    case 'Non-Compliant':
      return 'danger';
    case 'Pending Review':
      return 'warning';
    case 'Blacklisted':
      return 'info';
    default:
      return 'neutral';
  }
}

export function getTicketStatusBadgeVariant(
  status: TicketStatus,
): 'success' | 'warning' | 'danger' | 'info' | 'neutral' {
  switch (status) {
    case 'Paid':
      return 'success';
    case 'Unpaid':
      return 'danger';
    case 'Partial Payment':
      return 'warning';
    case 'Cancelled':
      return 'neutral';
    case 'Waived':
      return 'info';
    default:
      return 'neutral';
  }
}
