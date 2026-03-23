import { Response } from 'express';
import { AuthenticatedRequest } from '../types';

export async function list(req: AuthenticatedRequest, res: Response): Promise<void> {
  // TODO: Parse pagination, filter, sort params from req.query
  // TODO: Query tickets with JOIN on drivers, offences
  // TODO: Filter by status, date range, agent_id
  // TODO: Return paginated results
  res.status(501).json({ error: 'Not implemented' });
}

export async function getById(req: AuthenticatedRequest, res: Response): Promise<void> {
  // TODO: Fetch ticket by req.params.id with related driver/payment data
  // TODO: Return ticket or 404
  res.status(501).json({ error: 'Not implemented' });
}

export async function create(req: AuthenticatedRequest, res: Response): Promise<void> {
  // TODO: Validate req.body (driver_id, offence_code, location)
  // TODO: Look up offence to get fine_amount
  // TODO: Generate ticket_number (e.g., TKT-YYYYMMDD-XXXX)
  // TODO: Set due_date (e.g., 30 days from now)
  // TODO: Insert ticket
  // TODO: Log audit entry
  // TODO: Send SMS notification to driver
  // TODO: Return created ticket
  res.status(501).json({ error: 'Not implemented' });
}

export async function cancel(req: AuthenticatedRequest, res: Response): Promise<void> {
  // TODO: Check ticket exists and is cancellable
  // TODO: Require Supervisor or Admin role
  // TODO: Update status to 'Cancelled'
  // TODO: Log audit entry with reason
  // TODO: Return updated ticket
  res.status(501).json({ error: 'Not implemented' });
}

export async function waive(req: AuthenticatedRequest, res: Response): Promise<void> {
  // TODO: Check ticket exists and is waivable
  // TODO: Require Admin role
  // TODO: Update status to 'Waived'
  // TODO: Log audit entry with reason and approval
  // TODO: Return updated ticket
  res.status(501).json({ error: 'Not implemented' });
}
