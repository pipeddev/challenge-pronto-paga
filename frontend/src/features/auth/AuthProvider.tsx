import { useCallback, useMemo, useState, type ReactNode } from 'react';
import { authApi } from '../../api/auth.api.ts';
import { AuthContext, type Session } from './auth-context.ts';

const STORAGE_KEY = 'risk-score-session';

// sessionStorage: la sesión muere al cerrar la pestaña.
// En producción usaría una cookie httpOnly + SameSite para mitigar XSS.
const loadSession = (): Session | null => {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Session) : null;
  } catch {
    return null;
  }
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(loadSession);

  const login = useCallback(async (username: string, password: string) => {
    const { token, user } = await authApi.login(username, password);
    const next = { token, user };
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setSession(next);
  }, []);

  const logout = useCallback(() => {
    sessionStorage.removeItem(STORAGE_KEY);
    setSession(null);
  }, []);

  const value = useMemo(() => ({ session, login, logout }), [session, login, logout]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
