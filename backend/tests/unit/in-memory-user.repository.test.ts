import { describe, expect, it } from 'vitest';
import { InMemoryUserRepository } from '../../src/infrastructure/persistence/in-memory-user.repository.ts';

describe('InMemoryUserRepository', () => {
  it('incluye los usuarios semilla admin y user', async () => {
    const repo = new InMemoryUserRepository();

    expect(await repo.findByUsername('admin')).toMatchObject({
      id: 'u-001',
      role: 'admin',
    });
    expect(await repo.findByUsername('user')).toMatchObject({
      id: 'u-002',
      role: 'user',
      rut: '12.345.678-5',
    });
  });

  it('devuelve null si el usuario no existe', async () => {
    const repo = new InMemoryUserRepository();
    expect(await repo.findByUsername('nadie')).toBeNull();
  });

  it('busca por coincidencia exacta (sensible a mayúsculas)', async () => {
    const repo = new InMemoryUserRepository();
    expect(await repo.findByUsername('ADMIN')).toBeNull();
  });

  it('permite inyectar una lista de usuarios propia', async () => {
    const repo = new InMemoryUserRepository([
      { id: 'x', username: 'custom', password: 'pw', role: 'user' },
    ]);

    expect(await repo.findByUsername('custom')).toMatchObject({ id: 'x' });
    expect(await repo.findByUsername('admin')).toBeNull();
  });
});
