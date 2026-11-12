import 'dotenv/config';

const isTest = process.env.NODE_ENV === 'test' || process.env.VITEST === 'true';
const jwtSecret = process.env.JWT_SECRET ?? (isTest ? 'test-secret' : undefined);
if (!jwtSecret) throw new Error('JWT_SECRET no está definido. Copia .env.example a .env');

export const env = {
  port: Number(process.env.PORT ?? 3000),
  jwtSecret,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? '1h',
  corsOrigin: process.env.CORS_ORIGIN ?? 'http://localhost:5173',
} as const;
