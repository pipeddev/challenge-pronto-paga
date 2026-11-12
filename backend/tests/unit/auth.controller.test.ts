import type { NextFunction, Request, Response } from "express";
import { describe, expect, it, vi } from "vitest";
import type {
  LoginOutput,
  LoginUseCase,
} from "../../src/application/use-cases/login.use-case.js";
import { AuthController } from "../../src/infrastructure/http/controllers/auth.controller.js";
import { Errors } from "../../src/shared/errors.js";

const OUTPUT: LoginOutput = {
  token: "tok",
  user: { id: "u-001", username: "admin", role: "admin" },
};

const setup = (execute = vi.fn().mockResolvedValue(OUTPUT)) => {
  const controller = new AuthController({
    execute,
  } as unknown as LoginUseCase);
  const res = { json: vi.fn() };
  const next = vi.fn();
  const call = (body: unknown) =>
    controller.login(
      { body } as Request,
      res as unknown as Response,
      next as NextFunction,
    );
  return { execute, res, next, call };
};

describe("AuthController.login", () => {
  it("responde con el resultado del caso de uso", async () => {
    const { execute, res, next, call } = setup();
    await call({ username: "admin", password: "admin123" });

    expect(execute).toHaveBeenCalledWith({
      username: "admin",
      password: "admin123",
    });
    expect(res.json).toHaveBeenCalledWith(OUTPUT);
    expect(next).not.toHaveBeenCalled();
  });

  it("recorta espacios del username pero no de la contraseña", async () => {
    const { execute, call } = setup();
    await call({ username: "  admin  ", password: " pw " });

    expect(execute).toHaveBeenCalledWith({
      username: "admin",
      password: " pw ",
    });
  });

  it.each([
    ["body undefined", undefined],
    ["body vacío", {}],
    ["sin password", { username: "admin" }],
    ["sin username", { password: "x" }],
    ["username vacío", { username: "", password: "x" }],
    ["username solo espacios", { username: "   ", password: "x" }],
    ["password vacío", { username: "admin", password: "" }],
    ["username no string", { username: 123, password: "x" }],
    ["password no string", { username: "admin", password: ["x"] }],
  ])("rechaza con BAD_REQUEST: %s", async (_label, body) => {
    const { execute, res, next, call } = setup();
    await call(body);

    expect(execute).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledOnce();
    expect(next.mock.calls[0][0]).toMatchObject({ code: "BAD_REQUEST" });
  });

  it("propaga a next los errores del caso de uso", async () => {
    const error = Errors.invalidCredentials();
    const { res, next, call } = setup(vi.fn().mockRejectedValue(error));
    await call({ username: "admin", password: "mala" });

    expect(next).toHaveBeenCalledWith(error);
    expect(res.json).not.toHaveBeenCalled();
  });
});
