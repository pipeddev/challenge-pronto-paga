import type { ScoreResponse } from '../api/score.api.ts';
import { getScoreLevel } from '../utils/score-level.ts';

interface ScoreResultProps {
  result: ScoreResponse;
}

const formatDate = (iso: string): string => {
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? iso : date.toLocaleString('es-CL');
};

export function ScoreResult({ result }: ScoreResultProps) {
  const { level, label } = getScoreLevel(result.score);
  return (
    <section className={`result ${level}`} aria-live="polite">
      <span className="score">{result.score}</span>
      <span className="level">{label}</span>
      <dl>
        <dt>RUT</dt>
        <dd>{result.rut}</dd>
        <dt>Fecha</dt>
        <dd>{formatDate(result.fecha)}</dd>
      </dl>
    </section>
  );
}
