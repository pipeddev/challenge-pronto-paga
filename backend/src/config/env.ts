import 'dotenv/config';

const isTest = process.env.NODE_ENV === 'test' || process.env.VITEST === 'true';
const jwtSecret = process.env.JWT_SECRET ?? (isTest ? 'test-secret' : undefined);
if (!jwtSecret) throw new Error('JWT_SECRET no está definido. Copia .env.example a .env');

const positiveInt = (value: string | undefined, fallback: number): number => {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
};

export const env = {
  port: Number(process.env.PORT ?? 3000),
  jwtSecret,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? '1h',
  corsOrigin: process.env.CORS_ORIGIN ?? 'http://localhost:5173',
  loginRateLimit: {
    max: positiveInt(process.env.LOGIN_RATE_LIMIT_MAX, 5),
    windowMs: positiveInt(process.env.LOGIN_RATE_LIMIT_WINDOW_MS, 15 * 60 * 1000),
  },
} as const;
