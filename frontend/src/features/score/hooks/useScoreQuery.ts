import { useState, type SubmitEvent } from 'react';
import { useAuth } from '../../auth/index.ts';
import { ApiError } from '../../../shared/api/http-client.ts';
import { formatRutInput, isRutComplete, isValidRut } from '../../../shared/utils/rut.ts';
import { scoreApi, type ScoreResponse } from '../api/score.api.ts';

export function useScoreQuery() {
  const { session, logout } = useAuth();
  const ownRut = session?.user.role === 'user' ? session.user.rut : undefined;
  // El rol user solo puede consultar su propio RUT: el campo queda bloqueado.
  const rutLocked = !!ownRut;

  const [rut, setRut] = useState(() => (ownRut ? formatRutInput(ownRut) : ''));
  const [result, setResult] = useState<ScoreResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const rutValid = isValidRut(rut);
  const rutError = !rutValid && isRutComplete(rut) ? 'El RUT ingresado no es válido' : null;
  const canSubmit = !loading && rutValid;

  const handleRutChange = (value: string) => {
    if (rutLocked) return;
    setRut(formatRutInput(value));
    setError(null);
  };

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!session || !rutValid) return;
    setError(null);
    setResult(null);
    setLoading(true);
    try {
      setResult(await scoreApi.getByRut(rut, session.token));
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        // Token inválido o expirado: se cierra la sesión y vuelve al login.
        logout();
        return;
      }
      setError(err instanceof ApiError ? err.message : 'No se pudo consultar el score');
    } finally {
      setLoading(false);
    }
  };

  return {
    rut,
    rutLocked,
    handleRutChange,
    rutError,
    result,
    error,
    loading,
    canSubmit,
    handleSubmit,
  };
}
