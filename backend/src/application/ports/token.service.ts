import type { AuthPrincipal } from "../../domain/user.js";

export interface TokenService {
  sign(principal: AuthPrincipal): string;
}
