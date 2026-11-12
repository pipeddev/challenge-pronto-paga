import { createHash, timingSafeEqual } from 'node:crypto';

const digest = (value: string): Buffer => createHash('sha256').update(value, 'utf8').digest();

/**
 * Compara dos strings en tiempo constante.
 * Se comparan los SHA-256 de ambos valores: así los buffers siempre miden lo mismo
 * (timingSafeEqual lanza si los largos difieren) y tampoco se filtra el largo del secreto.
 */
export const safeEqual = (a: string, b: string): boolean => timingSafeEqual(digest(a), digest(b));
