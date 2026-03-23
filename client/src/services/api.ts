const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

function getAuthToken(): string | null {
  return localStorage.getItem('auth_token');
}

async function request<T>(
  method: string,
  endpoint: string,
  body?: unknown,
): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  const token = getAuthToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config: RequestInit = {
    method,
    headers,
  };

  if (body && (method === 'POST' || method === 'PUT')) {
    config.body = JSON.stringify(body);
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, config);

  if (!response.ok) {
    const error = await response.json().catch(() => ({
      message: response.statusText,
    }));
    throw new Error(error.message || `Request failed with status ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export const api = {
  get<T>(endpoint: string): Promise<T> {
    return request<T>('GET', endpoint);
  },

  post<T>(endpoint: string, body?: unknown): Promise<T> {
    return request<T>('POST', endpoint, body);
  },

  put<T>(endpoint: string, body?: unknown): Promise<T> {
    return request<T>('PUT', endpoint, body);
  },

  del<T>(endpoint: string): Promise<T> {
    return request<T>('DELETE', endpoint);
  },
};
