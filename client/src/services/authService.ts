import type { LoginRequest, LoginResponse, User } from '@/types';
import { mockUsers } from '@/mock';

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const authService = {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    await delay(300);

    const user = mockUsers.find(
      (u) => u.email === credentials.email && u.password === credentials.password,
    );

    if (!user) {
      throw new Error('Invalid email or password');
    }

    if (!user.is_active) {
      throw new Error('Account is deactivated. Contact an administrator.');
    }

    const { password: _, ...userWithoutPassword } = user;
    const token = btoa(
      JSON.stringify({ sub: user.id, role: user.role, exp: Date.now() + 86400000 }),
    );

    return {
      token,
      user: userWithoutPassword as User,
    };
  },

  async getCurrentUser(): Promise<User | null> {
    await delay(200);

    const token = localStorage.getItem('auth_token');
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token));
      const user = mockUsers.find((u) => u.id === payload.sub);
      if (!user) return null;

      const { password: _, ...userWithoutPassword } = user;
      return userWithoutPassword as User;
    } catch {
      return null;
    }
  },

  logout(): void {
    localStorage.removeItem('auth_token');
  },
};
