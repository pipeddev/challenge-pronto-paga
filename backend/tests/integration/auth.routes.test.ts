import jwt, { type JwtPayload } from 'jsonwebtoken';
import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { createApp } from '../../src/app.ts';
import { env } from '../../src/config/env.ts';

const app = createApp();

describe('HTTP /login', () => {
  it('GET /health responde ok', async () => {
    const res = await request(app).get('/health');

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: 'ok' });
    expect(res.headers['x-powered-by']).toBeUndefined();
  });

  it('POST /login con credenciales válidas devuelve un JWT válido', async () => {
    const res = await request(app).post('/login').send({ username: 'user', password: 'user123' });

    expect(res.status).toBe(200);
    expect(res.body.user).toEqual({
      id: 'u-002',
      username: 'user',
      role: 'user',
      rut: '12.345.678-5',
    });
    const payload = jwt.verify(res.body.token, env.jwtSecret) as JwtPayload;
    expect(payload).toMatchObject({ sub: 'u-002', role: 'user' });
  });

  it('POST /login con credenciales inválidas responde 401', async () => {
    const res = await request(app).post('/login').send({ username: 'user', password: 'mala' });

    expect(res.status).toBe(401);
    expect(res.body.error.code).toBe('INVALID_CREDENTIALS');
  });

  it('POST /login sin campos responde 400', async () => {
    const res = await request(app).post('/login').send({});

    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('BAD_REQUEST');
  });

  it('POST /login con JSON mal formado responde 400', async () => {
    const res = await request(app)
      .post('/login')
      .set('Content-Type', 'application/json')
      .send('{malo');

    expect(res.status).toBe(400);
    expect(res.body.error).toEqual({
      code: 'BAD_REQUEST',
      message: 'JSON inválido',
    });
  });

  it('ruta desconocida responde 404', async () => {
    const res = await request(app).get('/no-existe');

    expect(res.status).toBe(404);
    expect(res.body.error.code).toBe('NOT_FOUND');
  });
});
