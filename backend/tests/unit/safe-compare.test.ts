import { describe, expect, it } from 'vitest';
import { safeEqual } from '../../src/shared/safe-compare.ts';

describe('safeEqual', () => {
  it('devuelve true para strings iguales', () => {
    expect(safeEqual('user123', 'user123')).toBe(true);
  });

  it('devuelve false para strings distintos del mismo largo', () => {
    expect(safeEqual('user123', 'user124')).toBe(false);
  });

  it('no lanza y devuelve false con largos distintos', () => {
    expect(() => safeEqual('corta', 'una-mucho-mas-larga')).not.toThrow();
    expect(safeEqual('corta', 'una-mucho-mas-larga')).toBe(false);
    expect(safeEqual('', 'x')).toBe(false);
  });

  it('es sensible a mayúsculas', () => {
    expect(safeEqual('User123', 'user123')).toBe(false);
  });

  it('soporta caracteres multibyte', () => {
    expect(safeEqual('contraseña', 'contraseña')).toBe(true);
    expect(safeEqual('contraseña', 'contrasena')).toBe(false);
  });
});
