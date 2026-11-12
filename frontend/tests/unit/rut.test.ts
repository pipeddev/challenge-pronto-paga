import { describe, expect, it } from 'vitest';
import { formatRutInput, isRutComplete, isValidRut } from '../../src/shared/utils/rut.ts';

describe('formatRutInput', () => {
  it.each([
    ['', ''],
    ['1', '1'],
    ['12', '1-2'],
    ['1234', '123-4'],
    ['123456785', '12.345.678-5'],
    ['12.345.678-5', '12.345.678-5'],
    ['1000005k', '1.000.005-K'],
  ])('formatea %j como %j', (input, expected) => {
    expect(formatRutInput(input)).toBe(expected);
  });

  it('ignora caracteres no válidos', () => {
    expect(formatRutInput('12a.345 678/5')).toBe('12.345.678-5');
  });

  it('limita el largo a 8 dígitos más el verificador', () => {
    expect(formatRutInput('12.345.678-55')).toBe('12.345.678-5');
  });

  it('solo admite K como dígito verificador', () => {
    expect(formatRutInput('K')).toBe('');
    expect(formatRutInput('1k2')).toBe('1-2');
  });
});

describe('isValidRut', () => {
  it.each(['12.345.678-5', '123456785', '11.111.111-1', '1.000.005-K', '1.000.005-k'])(
    'acepta %s',
    (rut) => {
      expect(isValidRut(rut)).toBe(true);
    },
  );

  it.each(['12.345.678-9', '12.345.678-4', '', '1-9', '123.456-0', 'abc'])('rechaza %j', (rut) => {
    expect(isValidRut(rut)).toBe(false);
  });
});

describe('isRutComplete', () => {
  it('requiere al menos 8 caracteres útiles', () => {
    expect(isRutComplete('1.234.567')).toBe(false);
    expect(isRutComplete('1.234.567-8')).toBe(true);
  });
});
