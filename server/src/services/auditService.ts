import { query } from '../config/database';

interface AuditEntry {
  user_id: string;
  action: string;
  entity_type: string;
  entity_id: string;
  details?: Record<string, unknown>;
  ip_address?: string;
}

export async function createAuditEntry(entry: AuditEntry): Promise<void> {
  // TODO: Insert into audit_logs table
  // TODO: This should never throw - wrap in try/catch and log errors
  console.log('[AUDIT]', JSON.stringify(entry));
}
