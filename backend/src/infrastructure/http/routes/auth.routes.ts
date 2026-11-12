import { Router } from 'express';
import type { AuthController } from '../controllers/auth.controller.ts';

export const authRoutes = (controller: AuthController): Router => {
  const router = Router();
  router.post('/login', controller.login);
  return router;
};
