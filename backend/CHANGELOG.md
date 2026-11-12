# Changelog

## [Sin publicar]

### Añadido

- Endpoint `POST /login` que emite un JWT.
- Arquitectura hexagonal (dominio, casos de uso, puertos y adaptadores).
- Usuarios mock `admin` y `user`.
- Manejo centralizado de errores HTTP.
- Tests unitarios y de integración.
- Endpoint `GET /score/:rut` protegido con JWT.
- Validación de RUT con dígito verificador (módulo 11).
- Autorización por rol: `admin` consulta cualquier RUT y `user` solo el suyo.
- Score determinista de 0 a 100 por RUT.
- Middleware de autenticación con token Bearer.
- Verificación de JWT con errores de token inválido y expirado.
