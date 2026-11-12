import { httpRequest } from './http-client.ts';

export type Role = 'admin' | 'user';

export interface AuthUser {
  id: string;
  username: string;
  role: Role;
  rut?: string;
}

export interface LoginResponse {
  token: string;
  user: AuthUser;
}

export const authApi = {
  login: (username: string, password: string) =>
    httpRequest<LoginResponse>('/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    }),
};
