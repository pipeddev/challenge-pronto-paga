import type { User } from "../../domain/user.js";

export interface UserRepository {
  findByUsername(username: string): Promise<User | null>;
}
