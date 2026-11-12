import type { Rut } from '../../domain/rut.ts';
import type { AuthPrincipal } from '../../domain/user.ts';

declare global {
  namespace Express {
    interface Request {
      user?: AuthPrincipal;
      targetRut?: Rut;
    }
  }
}

export {};
