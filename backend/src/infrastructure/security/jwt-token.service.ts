import jwt, { type SignOptions } from "jsonwebtoken";
import type { TokenService } from "../../application/ports/token.service.js";
import type { AuthPrincipal } from "../../domain/user.js";

export class JwtTokenService implements TokenService {
  constructor(
    private readonly secret: string,
    private readonly expiresIn: string,
  ) {}

  sign(principal: AuthPrincipal): string {
    return jwt.sign(principal, this.secret, {
      algorithm: "HS256",
      expiresIn: this.expiresIn as SignOptions["expiresIn"],
    });
  }
}
