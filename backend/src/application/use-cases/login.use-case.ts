import type { AuthPrincipal, Role } from '../../domain/user.ts';
import { Errors } from '../../shared/errors.ts';
import { safeEqual } from '../../shared/safe-compare.ts';
import type { TokenService } from '../ports/token.service.ts';
import type { UserRepository } from '../ports/user.repository.ts';

const DUMMY_PASSWORD = 'dummy-password-for-timing';

export interface LoginInput {
  username: string;
  password: string;
}

export interface LoginOutput {
  token: string;
  user: { id: string; username: string; role: Role; rut?: string };
}

export class LoginUseCase {
  constructor(
    private readonly users: UserRepository,
    private readonly tokens: TokenService,
  ) {}

  async execute({ username, password }: LoginInput): Promise<LoginOutput> {
    const user = await this.users.findByUsername(username);
    const passwordMatches = safeEqual(password, user?.password ?? DUMMY_PASSWORD);
    if (!user || !passwordMatches) throw Errors.invalidCredentials();

    const principal: AuthPrincipal = {
      sub: user.id,
      role: user.role,
      ...(user.role === 'user' && user.rut ? { rut: user.rut } : {}),
    };

    return {
      token: this.tokens.sign(principal),
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
        rut: principal.rut,
      },
    };
  }
}
