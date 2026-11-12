import { describe, expect, it } from 'vitest';
import type { TokenService } from '../../src/application/ports/token.service.ts';
import { LoginUseCase } from '../../src/application/use-cases/login.use-case.ts';
import type { AuthPrincipal } from '../../src/domain/user.ts';
import { InMemoryUserRepository } from '../../src/infrastructure/persistence/in-memory-user.repository.ts';

class FakeTokenService implements TokenService {
  lastPrincipal?: AuthPrincipal;
  sign(principal: AuthPrincipal): string {
    this.lastPrincipal = principal;
    return 'fake-token';
  }
}

const setup = () => {
  const tokens = new FakeTokenService();
  const useCase = new LoginUseCase(new InMemoryUserRepository(), tokens);
  return { useCase, tokens };
};

describe('LoginUseCase', () => {
  it('firma el token con sub, role y rut para el rol user', async () => {
    const { useCase, tokens } = setup();
    const result = await useCase.execute({
      username: 'user',
      password: 'user123',
    });

    expect(result.token).toBe('fake-token');
    expect(tokens.lastPrincipal).toEqual({
      sub: 'u-002',
      role: 'user',
      rut: '12.345.678-5',
    });
  });

  it('no incluye rut para el rol admin', async () => {
    const { useCase, tokens } = setup();
    await useCase.execute({ username: 'admin', password: 'admin123' });

    expect(tokens.lastPrincipal).toEqual({ sub: 'u-001', role: 'admin' });
  });

  it('rechaza contraseña incorrecta', async () => {
    const { useCase } = setup();
    await expect(useCase.execute({ username: 'user', password: 'mala' })).rejects.toMatchObject({
      code: 'INVALID_CREDENTIALS',
    });
  });

  it('devuelve los datos públicos del usuario sin la contraseña', async () => {
    const { useCase } = setup();
    const result = await useCase.execute({
      username: 'user',
      password: 'user123',
    });

    expect(result.user).toEqual({
      id: 'u-002',
      username: 'user',
      role: 'user',
      rut: '12.345.678-5',
    });
    expect(result.user).not.toHaveProperty('password');
  });

  it('no incluye rut si un usuario con rol user no tiene rut', async () => {
    const tokens = new FakeTokenService();
    const repo = new InMemoryUserRepository([
      { id: 'u-9', username: 'sinrut', password: 'pw', role: 'user' },
    ]);
    const result = await new LoginUseCase(repo, tokens).execute({
      username: 'sinrut',
      password: 'pw',
    });

    expect(tokens.lastPrincipal).toEqual({ sub: 'u-9', role: 'user' });
    expect(result.user.rut).toBeUndefined();
  });

  it('no incluye rut en el token de un admin aunque tenga rut', async () => {
    const tokens = new FakeTokenService();
    const repo = new InMemoryUserRepository([
      {
        id: 'a-9',
        username: 'root',
        password: 'pw',
        role: 'admin',
        rut: '11.111.111-1',
      },
    ]);
    await new LoginUseCase(repo, tokens).execute({
      username: 'root',
      password: 'pw',
    });

    expect(tokens.lastPrincipal).toEqual({ sub: 'a-9', role: 'admin' });
  });

  it('no firma token cuando las credenciales son inválidas', async () => {
    const { useCase, tokens } = setup();
    await expect(useCase.execute({ username: 'user', password: 'mala' })).rejects.toThrow();
    expect(tokens.lastPrincipal).toBeUndefined();
  });

  it('compara la contraseña de forma sensible a mayúsculas', async () => {
    const { useCase } = setup();
    await expect(useCase.execute({ username: 'user', password: 'USER123' })).rejects.toMatchObject({
      code: 'INVALID_CREDENTIALS',
    });
  });

  it('rechaza usuario inexistente con el mismo error', async () => {
    const { useCase } = setup();
    await expect(useCase.execute({ username: 'nadie', password: 'x' })).rejects.toMatchObject({
      code: 'INVALID_CREDENTIALS',
    });
  });
});
