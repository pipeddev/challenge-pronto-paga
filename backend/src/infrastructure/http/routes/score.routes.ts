import { Router, type RequestHandler } from 'express';
import type { ScoreController } from '../controllers/score.controller.ts';
import { authorizeRut } from '../middlewares/authorize-rut.ts';

export const scoreRoutes = (controller: ScoreController, authenticate: RequestHandler): Router => {
  const router = Router();
  router.get('/score/:rut', authenticate, authorizeRut, controller.getScore);
  return router;
};
