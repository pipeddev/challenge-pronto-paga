import { describe, expect, it } from 'vitest';
import { getScoreLevel } from '../../src/features/score/utils/score-level.ts';

describe('getScoreLevel', () => {
  it.each([
    [100, 'low', 'Riesgo bajo'],
    [70, 'low', 'Riesgo bajo'],
    [69, 'medium', 'Riesgo medio'],
    [40, 'medium', 'Riesgo medio'],
    [39, 'high', 'Riesgo alto'],
    [0, 'high', 'Riesgo alto'],
  ])('score %i → %s', (score, level, label) => {
    expect(getScoreLevel(score)).toEqual({ level, label });
  });
});
