import { Response } from 'express';
import { AuthenticatedRequest } from '../types';

export async function login(req: AuthenticatedRequest, res: Response): Promise<void> {
  // TODO: Validate email/password from req.body
  // TODO: Look up user in DB by email
  // TODO: Compare password with bcrypt
  // TODO: Generate JWT token
  // TODO: Return user profile + token
  res.status(501).json({ error: 'Not implemented' });
}

export async function getMe(req: AuthenticatedRequest, res: Response): Promise<void> {
  // TODO: Return req.user profile from DB (fresh lookup)
  res.status(501).json({ error: 'Not implemented' });
}

export async function logout(req: AuthenticatedRequest, res: Response): Promise<void> {
  // TODO: Optionally blacklist the token in Redis
  // TODO: Log audit entry
  res.status(501).json({ error: 'Not implemented' });
}
