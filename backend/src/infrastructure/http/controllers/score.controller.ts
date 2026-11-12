import type { NextFunction, Request, Response } from 'express';
import type { GetScoreUseCase } from '../../../application/use-cases/get-score.use-case.ts';
import { Errors } from '../../../shared/errors.ts';

export class ScoreController {
  constructor(private readonly getScoreUseCase: GetScoreUseCase) {}

  getScore = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.targetRut) throw Errors.invalidRut();
      res.json(await this.getScoreUseCase.execute(req.targetRut));
    } catch (err) {
      next(err);
    }
  };
}
