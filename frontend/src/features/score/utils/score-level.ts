export type ScoreLevel = 'low' | 'medium' | 'high';

export interface ScoreLevelInfo {
  level: ScoreLevel;
  label: string;
}

export function getScoreLevel(score: number): ScoreLevelInfo {
  if (score >= 70) return { level: 'low', label: 'Riesgo bajo' };
  if (score >= 40) return { level: 'medium', label: 'Riesgo medio' };
  return { level: 'high', label: 'Riesgo alto' };
}
