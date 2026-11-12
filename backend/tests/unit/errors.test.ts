import { describe, expect, it } from 'vitest';
import { AppError, Errors } from '../../src/shared/errors.ts';

describe('AppError / Errors', () => {
  it('AppError expone code, message y name', () => {
    const err = new AppError('NOT_FOUND', 'x');

    expect(err).toBeInstanceOf(Error);
    expect(err.code).toBe('NOT_FOUND');
    expect(err.message).toBe('x');
    expect(err.name).toBe('AppError');
  });

  it.each([
    ['invalidRut', 'INVALID_RUT'],
    ['invalidCredentials', 'INVALID_CREDENTIALS'],
    ['missingToken', 'MISSING_TOKEN'],
    ['invalidToken', 'INVALID_TOKEN'],
    ['tokenExpired', 'TOKEN_EXPIRED'],
    ['forbiddenRut', 'FORBIDDEN_RUT'],
    ['notFound', 'NOT_FOUND'],
    ['tooManyRequests', 'TOO_MANY_REQUESTS'],
  ] as const)('Errors.%s() crea un AppError con código %s', (factory, code) => {
    const err = Errors[factory]();

    expect(err).toBeInstanceOf(AppError);
    expect(err.code).toBe(code);
    expect(err.message).not.toBe('');
  });

  it('Errors.badRequest usa el mensaje recibido', () => {
    const err = Errors.badRequest('faltan campos');

    expect(err.code).toBe('BAD_REQUEST');
    expect(err.message).toBe('faltan campos');
  });
});
