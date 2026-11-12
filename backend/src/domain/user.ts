export type Role = 'admin' | 'user';

export interface User {
  id: string;
  username: string;
  password: string; // mock: en producción sería un hash (bcrypt/argon2)
  role: Role;
  rut?: string;
}

export interface AuthPrincipal {
  sub: string;
  role: Role;
  rut?: string;
}
