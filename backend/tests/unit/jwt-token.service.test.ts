import jwt, { type JwtPayload } from 'jsonwebtoken';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { JwtTokenService } from '../../src/infrastructure/security/jwt-token.service.ts';

const SECRET = 'unit-test-secret';

describe('JwtTokenService', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('firma un JWT verificable con el secreto que contiene el principal', () => {
    const service = new JwtTokenService(SECRET, '1h');
    const token = service.sign({ sub: 'u-002', role: 'user', rut: '1-9' });

    const payload = jwt.verify(token, SECRET) as JwtPayload;
    expect(payload).toMatchObject({ sub: 'u-002', role: 'user', rut: '1-9' });
  });

  it('usa el algoritmo HS256', () => {
    const token = new JwtTokenService(SECRET, '1h').sign({
      sub: 'u-001',
      role: 'admin',
    });

    const decoded = jwt.decode(token, { complete: true });
    expect(decoded?.header.alg).toBe('HS256');
  });

  it('aplica la expiración configurada', () => {
    const token = new JwtTokenService(SECRET, '2h').sign({
      sub: 'u-001',
      role: 'admin',
    });

    const { iat, exp } = jwt.decode(token) as JwtPayload;
    expect(exp! - iat!).toBe(2 * 60 * 60);
  });

  it('genera tokens que no se validan con otro secreto', () => {
    const token = new JwtTokenService(SECRET, '1h').sign({
      sub: 'u-001',
      role: 'admin',
    });

    expect(() => jwt.verify(token, 'otro-secreto')).toThrow(jwt.JsonWebTokenError);
  });

  it('el token deja de ser válido tras expirar', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-01-01T00:00:00Z'));
    const token = new JwtTokenService(SECRET, '1m').sign({
      sub: 'u-001',
      role: 'admin',
    });

    vi.setSystemTime(new Date('2026-01-01T00:02:00Z'));
    expect(() => jwt.verify(token, SECRET)).toThrow(jwt.TokenExpiredError);
  });
});
