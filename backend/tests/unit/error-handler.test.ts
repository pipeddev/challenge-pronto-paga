import type { NextFunction, Request, Response } from 'express';
import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  errorHandler,
  notFoundHandler,
} from '../../src/infrastructure/http/middlewares/error-handler.ts';
import { AppError, Errors, type ErrorCode } from '../../src/shared/errors.ts';

const mockRes = () => {
  const res = {
    status: vi.fn(),
    json: vi.fn(),
  };
  res.status.mockReturnValue(res);
  res.json.mockReturnValue(res);
  return res;
};

const run = (err: unknown) => {
  const res = mockRes();
  errorHandler(err, {} as Request, res as unknown as Response, vi.fn());
  return res;
};

describe('notFoundHandler', () => {
  it('delega un AppError NOT_FOUND al siguiente middleware', () => {
    const next = vi.fn();
    notFoundHandler({} as Request, {} as Response, next as NextFunction);

    expect(next).toHaveBeenCalledOnce();
    expect(next.mock.calls[0][0]).toMatchObject({ code: 'NOT_FOUND' });
  });
});

describe('errorHandler', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it.each<[ErrorCode, number]>([
    ['BAD_REQUEST', 400],
    ['INVALID_RUT', 400],
    ['INVALID_CREDENTIALS', 401],
    ['MISSING_TOKEN', 401],
    ['INVALID_TOKEN', 401],
    ['TOKEN_EXPIRED', 401],
    ['FORBIDDEN_RUT', 403],
    ['NOT_FOUND', 404],
    ['TOO_MANY_REQUESTS', 429],
  ])('mapea %s a HTTP %i', (code, status) => {
    const res = run(new AppError(code, 'msg'));

    expect(res.status).toHaveBeenCalledWith(status);
    expect(res.json).toHaveBeenCalledWith({ error: { code, message: 'msg' } });
  });

  it('responde 400 ante JSON mal formado del body-parser', () => {
    const err = Object.assign(new SyntaxError('Unexpected token'), {
      body: '{bad',
    });
    const res = run(err);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: { code: 'BAD_REQUEST', message: 'JSON inválido' },
    });
  });

  it('trata un SyntaxError sin body como error interno', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    const res = run(new SyntaxError('otro'));

    expect(res.status).toHaveBeenCalledWith(500);
  });

  it('responde 500 genérico sin filtrar detalles ante errores desconocidos', () => {
    const log = vi.spyOn(console, 'error').mockImplementation(() => {});
    const err = new Error('detalle interno sensible');
    const res = run(err);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: { code: 'INTERNAL_ERROR', message: 'Error interno del servidor' },
    });
    expect(log).toHaveBeenCalledWith(err);
  });

  it('usa el mensaje del AppError creado por las factories', () => {
    const res = run(Errors.invalidCredentials());

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      error: {
        code: 'INVALID_CREDENTIALS',
        message: 'Usuario o contraseña incorrectos',
      },
    });
  });
});
