# Consulta de Riesgo Financiero — MVP

API REST en **Node.js + TypeScript** con autenticación JWT y autorización por roles, y SPA en **React + TypeScript** para consultar el score crediticio de un RUT.

## Requisitos

- Node.js 20+
- pnpm 9+

## Ejecución local

**Backend** (http://localhost:3000)

```bash
cd backend
cp .env.example .env
pnpm install
pnpm dev
```

**Frontend** (http://localhost:5173), en otra terminal:

```bash
cd frontend
cp .env.example .env
pnpm install
pnpm dev
```

**Tests y checks del backend**

```bash
cd backend
pnpm test
pnpm typecheck
```

## Usuarios de prueba

| Usuario | Contraseña | Rol   | RUT asociado |
| ------- | ---------- | ----- | ------------ |
| admin   | admin123   | admin | —            |
| user    | user123    | user  | 12.345.678-5 |

Body para `POST /login`:

**user**

```json
{
  "username": "user",
  "password": "user123"
}
```

**admin**

```json
{
  "username": "admin",
  "password": "admin123"
}
```

## API

| Método | Ruta          | Auth   | Descripción                                       |
| ------ | ------------- | ------ | ------------------------------------------------- |
| POST   | `/login`      | —      | Retorna JWT con `sub`, `role` y `rut` (solo user) |
| GET    | `/score/:rut` | Bearer | Score determinista 0–100 del RUT                  |
| GET    | `/me`         | Bearer | Identidad del token (validación de sesión)        |
| GET    | `/health`     | —      | Health check                                      |

```bash
TOKEN=$(curl -s -X POST localhost:3000/login -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}' | sed -E 's/.*"token":"([^"]+)".*/\1/')
curl -s localhost:3000/score/11.111.111-1 -H "Authorization: Bearer $TOKEN"
```

### Errores

Todas las respuestas de error tienen la forma `{ "error": { "code", "message" } }`.

| Status | Código                                            | Caso                              |
| ------ | ------------------------------------------------- | --------------------------------- |
| 400    | `BAD_REQUEST`, `INVALID_RUT`                      | Body incompleto / RUT inválido    |
| 401    | `INVALID_CREDENTIALS`                             | Login fallido                     |
| 401    | `MISSING_TOKEN`, `INVALID_TOKEN`, `TOKEN_EXPIRED` | Problemas con el JWT              |
| 403    | `FORBIDDEN_RUT`                                   | Rol user consultando un RUT ajeno |

## Reglas de negocio

- **Autorización:** `admin` consulta cualquier RUT; `user` solo el RUT de su token.
- **Score determinista:** SHA-256 del RUT normalizado → primeros 4 bytes → `% 101`. El mismo RUT (con o sin puntos/guion) siempre da el mismo score.

  | RUT          | Score |
  | ------------ | ----- |
  | 12.345.678-5 | 12    |
  | 11.111.111-1 | 41    |
  | 22.222.222-2 | 59    |
  | 76.086.428-5 | 88    |

- **Validación de RUT:** se valida el dígito verificador (módulo 11).
  > ⚠️ El RUT de ejemplo del enunciado (`12.345.678-9`) tiene un dígito verificador inválido y responde `400 INVALID_RUT`. El RUT válido equivalente es `12.345.678-5`.

## Arquitectura

### Backend: hexagonal (puertos y adaptadores)

```
src/
├── domain/           # User, Rut (value object), política de acceso
├── application/
│   ├── ports/        # UserRepository, TokenService, ScoreProvider
│   └── use-cases/    # LoginUseCase, GetScoreUseCase
├── infrastructure/
│   ├── persistence/  # InMemoryUserRepository (mock)
│   ├── security/     # JwtTokenService (HS256)
│   ├── scoring/      # HashScoreProvider
│   └── http/         # controllers, routes, middlewares
├── shared/errors.ts  # errores con código de dominio
└── container.ts      # composition root
```

- Los casos de uso dependen de **puertos**, no de Express ni de `jsonwebtoken`. Cambiar el repositorio mock por una DB, o el score por un bureau externo, solo requiere un nuevo adaptador.
- Los errores llevan un código de dominio; el mapeo a status HTTP vive solo en la capa HTTP.
- Middlewares: `authenticate` (firma, expiración y forma del payload) → `authorizeRut` (RUT válido + política de rol).

### Frontend: módulos por feature

```
src/
├── app/              # App raíz
├── features/
│   ├── auth/         # api, context, hooks (useAuth, useLoginForm), LoginPage
│   └── score/        # api, hooks (useScoreQuery), ScorePage, ScoreResult
└── shared/           # http-client, componentes y utilidades
```

- Cada feature expone su API pública en `index.ts`.
- La lógica vive en hooks y los componentes solo presentan.
- Ante un `401` se cierra la sesión automáticamente; los `403` y los errores de red se muestran con mensajes claros.

## Decisiones y trade-offs

- **Sin base de datos:** el enunciado pide credenciales mock; el repositorio está aislado tras un puerto.
- **Contraseñas en texto plano en el mock:** en producción usaría hash (bcrypt/argon2).
- **Token en `sessionStorage`:** es simple para el MVP. En producción usaría una cookie `httpOnly` + `SameSite` para mitigar XSS.
- **Algoritmo fijo `HS256`** al firmar y verificar, para evitar ataques de confusión de algoritmo.
- Mismo error para usuario inexistente y contraseña incorrecta, para no permitir enumerar usuarios.

## Flujo de trabajo

GitFlow: `feat/*` → `develop` → `release/x.y.z` → `main` (con tag) y back-merge a `develop`.
CI (GitHub Actions) valida cada push a `main`, `develop` y `release/*`, y cada PR.
