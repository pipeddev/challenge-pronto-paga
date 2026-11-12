import type { NextFunction, Request, Response } from 'express';
import type { LoginUseCase } from '../../../application/use-cases/login.use-case.ts';
import { Errors } from '../../../shared/errors.ts';

export class AuthController {
  constructor(private readonly loginUseCase: LoginUseCase) {}

  login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { username, password } = (req.body ?? {}) as Record<string, unknown>;
      if (
        typeof username !== 'string' ||
        typeof password !== 'string' ||
        !username.trim() ||
        !password
      ) {
        throw Errors.badRequest('username y password son requeridos');
      }
      res.json(
        await this.loginUseCase.execute({
          username: username.trim(),
          password,
        }),
      );
    } catch (err) {
      next(err);
    }
  };
}
