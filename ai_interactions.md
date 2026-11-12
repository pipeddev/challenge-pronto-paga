# Uso de herramientas de IA

## Herramientas utilizadas

- **Claude (chat):** planificación, diseño de arquitectura, generación de código base y resolución de errores durante el desarrollo.
- **Claude Code:** refactor del frontend hacia módulos por feature, hardening de seguridad y tests del frontend, a partir de prompts con convenciones y criterios de aceptación definidos por mí.

## Cómo las integré en el flujo

1. Definí el alcance y el plan de entrega en commits incrementales, con una rama y un PR por funcionalidad (GitFlow).
2. Usé la IA para generar el código de cada paso y lo revisé antes de cada commit.
3. Validé cada cambio con `pnpm typecheck`, `pnpm lint`, `pnpm test` y pruebas manuales (curl y navegador).
4. Para Claude Code escribí prompts con convenciones explícitas (imports `.ts`, comillas simples, restricciones de TypeScript) y criterios de aceptación verificables, y revisé el diff antes de commitear.

## Detalle por área

| Área                           | Apoyo de IA                                                                     | Mi criterio / revisión                                                                                                   |
| ------------------------------ | ------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| Planificación                  | Desglose del desafío en pasos con un commit por paso                            | Definí el orden, el flujo GitFlow con PRs y la simulación de release                                                     |
| Arquitectura backend           | Propuesta hexagonal: puertos, casos de uso, adaptadores y composition root      | Elegí el enfoque y evité abstracciones innecesarias (sin DB, porque el enunciado no lo requiere)                         |
| Auth (JWT)                     | `LoginUseCase`, `JwtTokenService`, middleware `authenticate`                    | Verifiqué el payload (`rut` solo para rol user), el algoritmo fijo HS256 y la distinción entre token expirado e inválido |
| Score y autorización           | Value object `Rut` (módulo 11), política `canAccessRut`, SHA-256 `% 101`        | Validé el determinismo y la distribución con varios RUTs; detecté que el RUT del enunciado tiene un DV inválido          |
| Manejo de errores              | Códigos de dominio con mapeo a HTTP en la capa web                              | Definí los casos 400 / 401 / 403 y el formato de respuesta                                                               |
| Frontend                       | Cliente HTTP, contexto de auth, hooks `useLoginForm` y `useScoreQuery`, estilos | Resolví ajustes del template (`erasableSyntaxOnly`, regla `react-refresh`, `SubmitEvent` en React 19)                    |
| Refactor modular (Claude Code) | Reorganización por feature con `index.ts` como API pública                      | Escribí el prompt con la estructura objetivo y revisé que no cambiara el comportamiento                                  |
| Seguridad (Claude Code)        | helmet, rate limit en `/login`, comparación en tiempo constante                 | Definí los requisitos y revisé los tests de integración _(revisar)_                                                      |
| Tests                          | Unitarios e integración del backend; utilidades del frontend                    | Revisé los casos borde: token expirado, firma inválida, RUT ajeno, DV incorrecto                                         |
| Tooling y CI                   | Prettier, ESLint, tsconfig con imports `.ts`, workflow de GitHub Actions        | Fijé TypeScript 6 porque typescript-eslint aún no soporta TS 7; alineé la versión de pnpm entre local y CI               |
| Documentación                  | Borrador del README y de este archivo                                           | Lo ajusté a lo efectivamente implementado                                                                                |

## Problemas que la IA no anticipó y resolví durante el desarrollo

- Diferencias de versiones: `req.params` en Express 5 (`string | string[]`), `FormEvent` deprecado en React 19 y `erasableSyntaxOnly` en el template nuevo de Vite.
- Incompatibilidad de typescript-eslint con TypeScript 7.
- Configuración de `pnpm/action-setup` sin `package.json` en la raíz del monorepo.

## Enfoque

Usé la IA como acelerador, no como reemplazo del criterio técnico. Cada cambio fue revisado, probado y commiteado por mí, y entiendo y puedo explicar cada parte de la solución.
