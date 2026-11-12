import { describe, expect, it } from 'vitest';
import { Rut } from '../../src/domain/rut.ts';

describe('Rut', () => {
  it('acepta RUTs válidos con o sin formato', () => {
    expect(Rut.isValid('12.345.678-5')).toBe(true);
    expect(Rut.isValid('12345678-5')).toBe(true);
    expect(Rut.isValid('123456785')).toBe(true);
    expect(Rut.isValid('7.654.321-6')).toBe(true);
  });

  it('rechaza dígito verificador incorrecto y basura', () => {
    expect(Rut.isValid('12.345.678-9')).toBe(false);
    expect(Rut.isValid('abc')).toBe(false);
    expect(Rut.isValid('')).toBe(false);
  });

  it('normaliza y formatea', () => {
    const rut = Rut.create('123456785');
    expect(rut.value).toBe('123456785');
    expect(rut.format()).toBe('12.345.678-5');
  });

  it('compara ignorando el formato', () => {
    expect(Rut.create('12.345.678-5').equals(Rut.create('123456785'))).toBe(true);
  });
});
