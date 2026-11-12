import { Router, type RequestHandler } from 'express';
import type { AuthController } from '../controllers/auth.controller.ts';

export const authRoutes = (controller: AuthController, rateLimit: RequestHandler): Router => {
  const router = Router();
  router.post('/login', rateLimit, controller.login);
  return router;
};
