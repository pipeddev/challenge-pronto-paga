import { LoginUseCase } from "./application/use-cases/login.use-case.js";
import { env } from "./config/env.js";
import { AuthController } from "./infrastructure/http/controllers/auth.controller.js";
import { InMemoryUserRepository } from "./infrastructure/persistence/in-memory-user.repository.js";
import { JwtTokenService } from "./infrastructure/security/jwt-token.service.js";

export const buildContainer = () => {
  const userRepository = new InMemoryUserRepository();
  const tokenService = new JwtTokenService(env.jwtSecret, env.jwtExpiresIn);

  const loginUseCase = new LoginUseCase(userRepository, tokenService);

  return {
    authController: new AuthController(loginUseCase),
  };
};

export type Container = ReturnType<typeof buildContainer>;
