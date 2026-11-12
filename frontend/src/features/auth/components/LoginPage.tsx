import { Alert } from '../../../shared/components/Alert.tsx';
import { useLoginForm } from '../hooks/useLoginForm.ts';

export function LoginPage() {
  const { username, setUsername, password, setPassword, error, loading, canSubmit, handleSubmit } =
    useLoginForm();

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

        <button type="submit" disabled={!canSubmit}>
          {loading ? 'Ingresando…' : 'Ingresar'}
        </button>
      </form>

      <p className="hint">
        Demo: <code>admin / admin123</code> · <code>user / user123</code>
      </p>
    </main>
  );
}
