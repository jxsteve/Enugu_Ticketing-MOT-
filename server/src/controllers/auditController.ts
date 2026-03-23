import { Response } from 'express';
import { AuthenticatedRequest } from '../types';

export async function list(req: AuthenticatedRequest, res: Response): Promise<void> {
  // TODO: Parse pagination, filter params (user_id, entity_type, date range)
  // TODO: Query audit_logs with JOIN on users for user name
  // TODO: Return paginated results
  res.status(501).json({ error: 'Not implemented' });
}
