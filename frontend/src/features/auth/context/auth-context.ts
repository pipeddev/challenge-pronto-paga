import { createContext } from 'react';
import type { AuthUser } from '../api/auth.api.ts';

export interface Session {
  token: string;
  user: AuthUser;
}

export interface AuthContextValue {
  session: Session | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);
