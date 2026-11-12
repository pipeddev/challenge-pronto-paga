import type { AuthPrincipal } from '../../domain/user.ts';

export interface TokenService {
  sign(principal: AuthPrincipal): string;
  verify(token: string): AuthPrincipal;
}
