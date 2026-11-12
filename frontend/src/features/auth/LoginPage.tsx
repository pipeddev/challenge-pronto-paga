import { useState, type SubmitEvent } from 'react';
import { ApiError } from '../../api/http-client.ts';
import { Alert } from '../../shared/components/Alert.tsx';
import { useAuth } from './useAuth.ts';

export function LoginPage() {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(username.trim(), password);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'No se pudo iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="card">
      <h1>Consulta de Riesgo Financiero</h1>
      <p className="muted">Inicia sesión para continuar</p>

      <form onSubmit={handleSubmit} noValidate>
        <label>
          Usuario
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
          />
        </label>
        <label>
          Contraseña
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />
        </label>

        {error && <Alert type="error" message={error} />}

        <button type="submit" disabled={loading || !username || !password}>
          {loading ? 'Ingresando…' : 'Ingresar'}
        </button>
      </form>

      <p className="hint">
        Demo: <code>admin / admin123</code> · <code>user / user123</code>
      </p>
    </main>
  );
}
