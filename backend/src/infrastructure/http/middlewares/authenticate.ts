import type { NextFunction, Request, RequestHandler, Response } from 'express';
import type { TokenService } from '../../../application/ports/token.service.ts';
import { Errors } from '../../../shared/errors.ts';

export const authenticate =
  (tokens: TokenService): RequestHandler =>
  (req: Request, _res: Response, next: NextFunction): void => {
    const header = req.headers.authorization;
    if (!header?.startsWith('Bearer ')) return next(Errors.missingToken());

    const token = header.slice('Bearer '.length).trim();
    if (!token) return next(Errors.missingToken());

    try {
      req.user = tokens.verify(token);
      next();
    } catch (err) {
      next(err);
    }
  };
