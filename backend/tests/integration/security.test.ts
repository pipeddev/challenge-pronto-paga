import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { createApp } from '../../src/app.ts';
import { buildContainer } from '../../src/container.ts';

const appWithLimit = (max: number) =>
  createApp(buildContainer({ loginRateLimit: { max, windowMs: 15 * 60 * 1000 } }));

describe('Rate limit de POST /login', () => {
  it('el 6º intento dentro de la ventana responde 429 con el formato estándar', async () => {
    const app = appWithLimit(5);

    for (let i = 0; i < 5; i++) {
      const res = await request(app).post('/login').send({ username: 'user', password: 'mala' });
      expect(res.status).toBe(401);
    }

    const res = await request(app).post('/login').send({ username: 'user', password: 'user123' });
    expect(res.status).toBe(429);
    expect(res.body).toEqual({
      error: { code: 'TOO_MANY_REQUESTS', message: 'Demasiados intentos, intenta más tarde' },
    });
  });

  it('también cuenta los logins exitosos', async () => {
    const app = appWithLimit(2);
    const body = { username: 'admin', password: 'admin123' };

    expect((await request(app).post('/login').send(body)).status).toBe(200);
    expect((await request(app).post('/login').send(body)).status).toBe(200);
    expect((await request(app).post('/login').send(body)).status).toBe(429);
  });

  it('expone los headers estándar de RateLimit', async () => {
    const res = await request(appWithLimit(5))
      .post('/login')
      .send({ username: 'user', password: 'user123' });

    expect(res.headers['ratelimit-policy']).toBeDefined();
    expect(res.headers['ratelimit']).toBeDefined();
  });

  it('no limita otras rutas', async () => {
    const app = appWithLimit(1);
    await request(app).post('/login').send({ username: 'user', password: 'mala' });

    for (let i = 0; i < 3; i++) {
      expect((await request(app).get('/health')).status).toBe(200);
    }
  });

  it('cada instancia de app tiene su propio contador', async () => {
    const body = { username: 'user', password: 'mala' };
    const first = appWithLimit(1);
    await request(first).post('/login').send(body);
    expect((await request(first).post('/login').send(body)).status).toBe(429);

    expect((await request(appWithLimit(1)).post('/login').send(body)).status).toBe(401);
  });
});

describe('Headers de seguridad (helmet)', () => {
  it('agrega los headers de seguridad y oculta x-powered-by', async () => {
    const res = await request(appWithLimit(5)).get('/health');

    expect(res.headers['x-content-type-options']).toBe('nosniff');
    expect(res.headers['x-frame-options']).toBe('SAMEORIGIN');
    expect(res.headers['strict-transport-security']).toContain('max-age=');
    expect(res.headers['content-security-policy']).toBeDefined();
    expect(res.headers['x-powered-by']).toBeUndefined();
  });

  it('también aplica en respuestas de error', async () => {
    const res = await request(appWithLimit(5)).get('/no-existe');

    expect(res.status).toBe(404);
    expect(res.headers['x-content-type-options']).toBe('nosniff');
  });
});
