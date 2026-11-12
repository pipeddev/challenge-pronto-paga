import jwt, { type SignOptions } from 'jsonwebtoken';
import type { TokenService } from '../../application/ports/token.service.ts';
import type { AuthPrincipal } from '../../domain/user.ts';
import { Errors } from '../../shared/errors.ts';

const isAuthPrincipal = (value: unknown): value is AuthPrincipal => {
  if (typeof value !== 'object' || value === null) return false;
  const p = value as Record<string, unknown>;
  return (
    typeof p.sub === 'string' &&
    (p.role === 'admin' || p.role === 'user') &&
    (p.rut === undefined || typeof p.rut === 'string')
  );
};

export class JwtTokenService implements TokenService {
  constructor(
    private readonly secret: string,
    private readonly expiresIn: string,
  ) {}

  sign(principal: AuthPrincipal): string {
    return jwt.sign(principal, this.secret, {
      algorithm: 'HS256',
      expiresIn: this.expiresIn as SignOptions['expiresIn'],
    });
  }

  verify(token: string): AuthPrincipal {
    let decoded: unknown;
    try {
      decoded = jwt.verify(token, this.secret, { algorithms: ['HS256'] });
    } catch (err) {
      if (err instanceof jwt.TokenExpiredError) throw Errors.tokenExpired();
      throw Errors.invalidToken();
    }
    if (!isAuthPrincipal(decoded)) throw Errors.invalidToken();
    return {
      sub: decoded.sub,
      role: decoded.role,
      ...(decoded.rut ? { rut: decoded.rut } : {}),
    };
  }
}
