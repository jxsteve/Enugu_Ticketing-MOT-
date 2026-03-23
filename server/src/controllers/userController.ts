import { Response } from 'express';
import { AuthenticatedRequest } from '../types';

export async function list(req: AuthenticatedRequest, res: Response): Promise<void> {
  // TODO: Parse pagination & filter params (role, is_active, search)
  // TODO: Query users table (exclude password_hash from results)
  // TODO: Return paginated results
  res.status(501).json({ error: 'Not implemented' });
}

export async function create(req: AuthenticatedRequest, res: Response): Promise<void> {
  // TODO: Validate req.body (name, email, phone, role, password)
  // TODO: Check for duplicate email
  // TODO: Hash password with bcrypt
  // TODO: Generate agent_id
  // TODO: Insert user
  // TODO: Log audit entry
  // TODO: Return created user (without password_hash)
  res.status(501).json({ error: 'Not implemented' });
}

export async function update(req: AuthenticatedRequest, res: Response): Promise<void> {
  // TODO: Validate req.body fields
  // TODO: If password provided, hash it
  // TODO: Update user record
  // TODO: Log audit entry
  // TODO: Return updated user (without password_hash)
  res.status(501).json({ error: 'Not implemented' });
}
