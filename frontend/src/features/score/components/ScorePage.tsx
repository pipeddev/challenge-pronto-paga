import { useAuth } from '../../auth/index.ts';
import { Alert } from '../../../shared/components/Alert.tsx';
import { useScoreQuery } from '../hooks/useScoreQuery.ts';
import { ScoreResult } from './ScoreResult.tsx';

export function ScorePage() {
  const { session, logout } = useAuth();
  const {
    rut,
    rutLocked,
    handleRutChange,
    rutError,
    result,
    error,
    loading,
    canSubmit,
    handleSubmit,
  } = useScoreQuery();

  if (!session) return null;
  const { user } = session;

  return (
    <main className="card">
      <header className="topbar">
        <span>
          {user.username}
          <span className={`badge badge-${user.role}`}>{user.role}</span>
        </span>
        <button type="button" className="link" onClick={logout}>
          Cerrar sesión
        </button>
      </header>

      <h1>Consulta de Riesgo Financiero</h1>
      <p className="muted">
        {user.role === 'admin'
          ? 'Puedes consultar el score de riesgo de cualquier RUT.'
          : 'Solo puedes consultar el score de riesgo asociado a tu RUT.'}
      </p>

      <form onSubmit={handleSubmit} noValidate>
        <label>
          RUT
          <input
            value={rut}
            onChange={(e) => handleRutChange(e.target.value)}
            readOnly={rutLocked}
            placeholder="12.345.678-5"
            inputMode="text"
            autoComplete="off"
            aria-invalid={rutError ? true : undefined}
          />
        </label>

        {rutError && <Alert type="error" message={rutError} />}
        {error && <Alert type="error" message={error} />}

        <button type="submit" disabled={!canSubmit}>
          {loading ? 'Consultando…' : 'Consultar score'}
        </button>
      </form>

      {result && <ScoreResult result={result} />}
    </main>
  );
}
