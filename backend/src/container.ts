import { LoginUseCase } from './application/use-cases/login.use-case.ts';
import { env } from './config/env.ts';
import { AuthController } from './infrastructure/http/controllers/auth.controller.ts';
import { InMemoryUserRepository } from './infrastructure/persistence/in-memory-user.repository.ts';
import { JwtTokenService } from './infrastructure/security/jwt-token.service.ts';
import { authenticate } from './infrastructure/http/middlewares/authenticate.ts';

export const buildContainer = () => {
  const userRepository = new InMemoryUserRepository();
  const tokenService = new JwtTokenService(env.jwtSecret, env.jwtExpiresIn);

  const loginUseCase = new LoginUseCase(userRepository, tokenService);

  return {
    authController: new AuthController(loginUseCase),
    authenticate: authenticate(tokenService),
  };
};

export type Container = ReturnType<typeof buildContainer>;
