import { Request } from 'express';
import { UserRole } from './models';

export interface AuthUser {
  id: string;
  name: string;
  role: UserRole;
  email: string;
  agent_id: string;
}

export interface AuthenticatedRequest extends Request {
  user?: AuthUser;
}

export interface PaginationQuery {
  page?: string;
  limit?: string;
}

export interface SortQuery {
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}
