import cors from 'cors';
import express from 'express';
import { env } from './config/env.ts';
import { buildContainer, type Container } from './container.ts';
import { errorHandler, notFoundHandler } from './infrastructure/http/middlewares/error-handler.ts';
import { authRoutes } from './infrastructure/http/routes/auth.routes.ts';
import { scoreRoutes } from './infrastructure/http/routes/score.routes.ts';

export const createApp = (container: Container = buildContainer()) => {
  const app = express();
  app.disable('x-powered-by');
  app.use(cors({ origin: env.corsOrigin }));
  app.use(express.json({ limit: '10kb' }));

  app.get('/health', (_req, res) => {
    res.json({ status: 'ok' });
  });

  app.get('/me', container.authenticate, (req, res) => {
    res.json({ user: req.user });
  });

  app.use(authRoutes(container.authController));
  app.use(scoreRoutes(container.scoreController, container.authenticate));

  app.use(notFoundHandler);
  app.use(errorHandler);
  return app;
};
