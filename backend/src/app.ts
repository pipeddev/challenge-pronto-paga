import cors from "cors";
import express from "express";
import { env } from "./config/env.js";
import { buildContainer, type Container } from "./container.js";
import {
  errorHandler,
  notFoundHandler,
} from "./infrastructure/http/middlewares/error-handler.js";
import { authRoutes } from "./infrastructure/http/routes/auth.routes.js";

export const createApp = (container: Container = buildContainer()) => {
  const app = express();
  app.disable("x-powered-by");
  app.use(cors({ origin: env.corsOrigin }));
  app.use(express.json({ limit: "10kb" }));

  app.get("/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  app.use(authRoutes(container.authController));

  app.use(notFoundHandler);
  app.use(errorHandler);
  return app;
};
