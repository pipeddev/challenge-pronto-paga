import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { createApp } from '../../src/app.ts';

const app = createApp();
const USER_RUT = '12.345.678-5';
const OTHER_RUT = '11.111.111-1';

const tokenFor = async (username: string, password: string): Promise<string> =>
  (await request(app).post('/login').send({ username, password })).body.token;

describe('GET /score/:rut', () => {
  it('401 sin token', async () => {
    const res = await request(app).get(`/score/${USER_RUT}`);
    expect(res.status).toBe(401);
  });

  it('user consulta su propio RUT (también sin puntos)', async () => {
    const token = await tokenFor('user', 'user123');
    const res = await request(app).get('/score/12345678-5').set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ rut: USER_RUT, score: expect.any(Number) });
  });

  it('403 si user consulta otro RUT', async () => {
    const token = await tokenFor('user', 'user123');
    const res = await request(app)
      .get(`/score/${OTHER_RUT}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(403);
    expect(res.body.error.code).toBe('FORBIDDEN_RUT');
  });

  it('admin consulta cualquier RUT', async () => {
    const token = await tokenFor('admin', 'admin123');
    const res = await request(app)
      .get(`/score/${OTHER_RUT}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.rut).toBe(OTHER_RUT);
  });

  it('400 con RUT inválido', async () => {
    const token = await tokenFor('admin', 'admin123');
    const res = await request(app)
      .get('/score/12.345.678-9')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('INVALID_RUT');
  });
});
