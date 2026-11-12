import { describe, expect, it } from 'vitest';
import { canAccessRut } from '../../src/domain/access-policy.ts';
import { Rut } from '../../src/domain/rut.ts';

const own = Rut.create('12.345.678-5');
const other = Rut.create('11.111.111-1');

describe('canAccessRut', () => {
  it('admin accede a cualquier RUT', () => {
    expect(canAccessRut({ sub: 'u-001', role: 'admin' }, other)).toBe(true);
  });

  it('user accede solo a su RUT, sin importar el formato', () => {
    const user = { sub: 'u-002', role: 'user' as const, rut: '12345678-5' };
    expect(canAccessRut(user, own)).toBe(true);
    expect(canAccessRut(user, other)).toBe(false);
  });

  it('user sin rut en el token no accede a nada', () => {
    expect(canAccessRut({ sub: 'u-003', role: 'user' }, own)).toBe(false);
  });
});
