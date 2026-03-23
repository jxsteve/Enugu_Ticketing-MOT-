export type UserRole = 'Admin' | 'Supervisor' | 'Agent' | 'Finance';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  email: string;
  phone: string;
  agent_id: string;
  is_active: boolean;
  created_at: string;
}
