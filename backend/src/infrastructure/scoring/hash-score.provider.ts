import { createHash } from 'node:crypto';
import type { ScoreProvider } from '../../application/ports/score.provider.ts';
import type { Rut } from '../../domain/rut.ts';

export class HashScoreProvider implements ScoreProvider {
  async getScore(rut: Rut): Promise<number> {
    const digest = createHash('sha256').update(rut.value).digest();
    return digest.readUInt32BE(0) % 101;
  }
}
