import type { Rut } from '../../domain/rut.ts';

export interface ScoreProvider {
  getScore(rut: Rut): Promise<number>;
}
