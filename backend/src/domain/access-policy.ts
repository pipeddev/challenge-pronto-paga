import { Rut } from './rut.ts';
import type { AuthPrincipal } from './user.ts';

export const canAccessRut = (principal: AuthPrincipal, target: Rut): boolean => {
  if (principal.role === 'admin') return true;
  if (principal.role === 'user' && principal.rut) {
    return Rut.isValid(principal.rut) && Rut.create(principal.rut).equals(target);
  }
  return false;
};
