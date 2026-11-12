import type { RequestHandler } from 'express';
import { rateLimit } from 'express-rate-limit';
import { Errors } from '../../../shared/errors.ts';

export interface LoginRateLimitOptions {
  max: number;
  windowMs: number;
}

export const loginRateLimit = ({ max, windowMs }: LoginRateLimitOptions): RequestHandler =>
  rateLimit({
    windowMs,
    limit: max,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    handler: (_req, _res, next) => next(Errors.tooManyRequests()),
  });
