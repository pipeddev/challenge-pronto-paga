import type { Rut } from '../../domain/rut.ts';
import type { ScoreProvider } from '../ports/score.provider.ts';

export interface ScoreOutput {
  rut: string;
  score: number;
  fecha: string;
}

export class GetScoreUseCase {
  constructor(
    private readonly scores: ScoreProvider,
    private readonly now: () => Date = () => new Date(),
  ) {}

  async execute(rut: Rut): Promise<ScoreOutput> {
    return {
      rut: rut.format(),
      score: await this.scores.getScore(rut),
      fecha: this.now()
        .toISOString()
        .replace(/\.\d{3}Z$/, 'Z'),
    };
  }
}
