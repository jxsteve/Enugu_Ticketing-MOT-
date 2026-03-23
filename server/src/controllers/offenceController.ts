import { Response } from 'express';
import { AuthenticatedRequest } from '../types';

export async function list(req: AuthenticatedRequest, res: Response): Promise<void> {
  // TODO: Query all offences, optionally filter by is_active
  // TODO: Return offence list
  res.status(501).json({ error: 'Not implemented' });
}

export async function update(req: AuthenticatedRequest, res: Response): Promise<void> {
  // TODO: Validate req.body (amount, description, is_active)
  // TODO: Update offence by req.params.code
  // TODO: Log audit entry
  // TODO: Return updated offence
  res.status(501).json({ error: 'Not implemented' });
}
