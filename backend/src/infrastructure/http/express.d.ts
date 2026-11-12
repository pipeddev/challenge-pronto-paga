import type { AuthPrincipal } from '../../domain/user.ts';

declare global {
  namespace Express {
    interface Request {
      user?: AuthPrincipal;
    }
  }
}

export {};
