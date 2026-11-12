import { Errors } from '../shared/errors.ts';

export class Rut {
  private constructor(private readonly clean: string) {}

  static create(raw: string): Rut {
    const clean = raw.replace(/[^0-9kK]/g, '').toUpperCase();
    if (!/^\d{7,8}[0-9K]$/.test(clean)) throw Errors.invalidRut();
    const body = clean.slice(0, -1);
    if (Rut.computeDv(body) !== clean.slice(-1)) throw Errors.invalidRut();
    return new Rut(clean);
  }

  static isValid(raw: string): boolean {
    try {
      Rut.create(raw);
      return true;
    } catch {
      return false;
    }
  }

  private static computeDv(body: string): string {
    let sum = 0;
    let multiplier = 2;
    for (let i = body.length - 1; i >= 0; i--) {
      sum += Number(body[i]) * multiplier;
      multiplier = multiplier === 7 ? 2 : multiplier + 1;
    }
    const result = 11 - (sum % 11);
    if (result === 11) return '0';
    if (result === 10) return 'K';
    return String(result);
  }

  get value(): string {
    return this.clean;
  }

  format(): string {
    const body = this.clean.slice(0, -1).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    return `${body}-${this.clean.slice(-1)}`;
  }

  equals(other: Rut): boolean {
    return this.clean === other.clean;
  }
}
