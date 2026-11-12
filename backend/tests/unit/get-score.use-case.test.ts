import { describe, expect, it } from 'vitest';
import { GetScoreUseCase } from '../../src/application/use-cases/get-score.use-case.ts';
import { Rut } from '../../src/domain/rut.ts';
import { HashScoreProvider } from '../../src/infrastructure/scoring/hash-score.provider.ts';

const fixedNow = () => new Date('2025-06-27T14:35:00.123Z');
const useCase = new GetScoreUseCase(new HashScoreProvider(), fixedNow);

describe('GetScoreUseCase', () => {
  it('retorna el formato esperado', async () => {
    const result = await useCase.execute(Rut.create('123456785'));
    expect(result).toEqual({
      rut: '12.345.678-5',
      score: expect.any(Number),
      fecha: '2025-06-27T14:35:00Z',
    });
  });

  it('es determinista e independiente del formato', async () => {
    const a = await useCase.execute(Rut.create('12.345.678-5'));
    const b = await useCase.execute(Rut.create('123456785'));
    expect(a.score).toBe(b.score);
  });

  it('está entre 0 y 100 y varía entre RUTs', async () => {
    const ruts = ['11.111.111-1', '22.222.222-2', '12.345.678-5', '7.654.321-6'];
    const scores = await Promise.all(
      ruts.map(async (r) => (await useCase.execute(Rut.create(r))).score),
    );
    scores.forEach((s) => expect(s).toBeGreaterThanOrEqual(0));
    scores.forEach((s) => expect(s).toBeLessThanOrEqual(100));
    expect(new Set(scores).size).toBeGreaterThan(1);
  });
});
