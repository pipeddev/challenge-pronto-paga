import type { User } from '../../domain/user.ts';

export interface UserRepository {
  findByUsername(username: string): Promise<User | null>;
}
