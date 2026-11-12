const MAX_RUT_LENGTH = 9; // 8 dígitos de cuerpo + dígito verificador

const cleanRut = (value: string): string => value.replace(/[^0-9kK]/g, '').toUpperCase();

const computeDv = (body: string): string => {
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
};

/** Formatea mientras se escribe: "123456785" → "12.345.678-5". La K solo se admite como DV. */
export function formatRutInput(value: string): string {
  const raw = cleanRut(value);
  const clean = (raw.slice(0, -1).replace(/K/g, '') + raw.slice(-1)).slice(0, MAX_RUT_LENGTH);
  if (clean.length <= 1) return clean.replace('K', '');
  const body = clean.slice(0, -1);
  const dv = clean.slice(-1);
  return `${body.replace(/\B(?=(\d{3})+(?!\d))/g, '.')}-${dv}`;
}

/** Validación local (módulo 11) para feedback inmediato; el backend es la fuente de verdad. */
export function isValidRut(value: string): boolean {
  const clean = cleanRut(value);
  if (!/^\d{7,8}[0-9K]$/.test(clean)) return false;
  return computeDv(clean.slice(0, -1)) === clean.slice(-1);
}

/** Indica si ya se escribió lo suficiente como para mostrar un error de validación. */
export function isRutComplete(value: string): boolean {
  return cleanRut(value).length >= 8;
}
