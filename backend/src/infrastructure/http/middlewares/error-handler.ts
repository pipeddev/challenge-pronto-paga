import type { NextFunction, Request, Response } from 'express';
import { AppError, Errors, type ErrorCode } from '../../../shared/errors.ts';

const STATUS_BY_CODE: Record<ErrorCode, number> = {
  BAD_REQUEST: 400,
  INVALID_RUT: 400,
  INVALID_CREDENTIALS: 401,
  MISSING_TOKEN: 401,
  INVALID_TOKEN: 401,
  TOKEN_EXPIRED: 401,
  FORBIDDEN_RUT: 403,
  NOT_FOUND: 404,
  TOO_MANY_REQUESTS: 429,
};

export const notFoundHandler = (_req: Request, _res: Response, next: NextFunction): void => {
  next(Errors.notFound());
};

export const errorHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  if (err instanceof AppError) {
    res.status(STATUS_BY_CODE[err.code]).json({ error: { code: err.code, message: err.message } });
    return;
  }
  if (err instanceof SyntaxError && 'body' in err) {
    res.status(400).json({ error: { code: 'BAD_REQUEST', message: 'JSON inválido' } });
    return;
  }
  console.error(err);
  res.status(500).json({
    error: { code: 'INTERNAL_ERROR', message: 'Error interno del servidor' },
  });
};
