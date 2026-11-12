import type { UserRepository } from "../../application/ports/user.repository.js";
import type { User } from "../../domain/user.js";

const SEED: User[] = [
  { id: "u-001", username: "admin", password: "admin123", role: "admin" },
  {
    id: "u-002",
    username: "user",
    password: "user123",
    role: "user",
    rut: "12.345.678-5",
  },
];

export class InMemoryUserRepository implements UserRepository {
  constructor(private readonly users: User[] = SEED) {}

  async findByUsername(username: string): Promise<User | null> {
    return this.users.find((u) => u.username === username) ?? null;
  }
}
