import type { NextFunction, Request, Response } from 'express';
import { canAccessRut } from '../../../domain/access-policy.ts';
import { Rut } from '../../../domain/rut.ts';
import { Errors } from '../../../shared/errors.ts';

export const authorizeRut = (req: Request, _res: Response, next: NextFunction): void => {
  if (!req.user) return next(Errors.missingToken());
  try {
    const rawRut = req.params.rut;
    const target = Rut.create(typeof rawRut === 'string' ? rawRut : '');
    if (!canAccessRut(req.user, target)) return next(Errors.forbiddenRut());
    req.targetRut = target;
    next();
  } catch (err) {
    next(err);
  }
};
