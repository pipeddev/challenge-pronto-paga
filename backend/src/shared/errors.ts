export type ErrorCode =
  | 'BAD_REQUEST'
  | 'INVALID_RUT'
  | 'INVALID_CREDENTIALS'
  | 'MISSING_TOKEN'
  | 'INVALID_TOKEN'
  | 'TOKEN_EXPIRED'
  | 'FORBIDDEN_RUT'
  | 'NOT_FOUND'
  | 'TOO_MANY_REQUESTS';

export class AppError extends Error {
  constructor(
    public readonly code: ErrorCode,
    message: string,
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export const Errors = {
  badRequest: (msg: string) => new AppError('BAD_REQUEST', msg),
  invalidRut: () => new AppError('INVALID_RUT', 'El RUT ingresado no es válido'),
  invalidCredentials: () => new AppError('INVALID_CREDENTIALS', 'Usuario o contraseña incorrectos'),
  missingToken: () => new AppError('MISSING_TOKEN', 'Token de autenticación requerido'),
  invalidToken: () => new AppError('INVALID_TOKEN', 'Token inválido'),
  tokenExpired: () => new AppError('TOKEN_EXPIRED', 'La sesión expiró, vuelve a iniciar sesión'),
  forbiddenRut: () => new AppError('FORBIDDEN_RUT', 'No tienes permiso para consultar este RUT'),
  notFound: () => new AppError('NOT_FOUND', 'Recurso no encontrado'),
  tooManyRequests: () =>
    new AppError('TOO_MANY_REQUESTS', 'Demasiados intentos, intenta más tarde'),
};
