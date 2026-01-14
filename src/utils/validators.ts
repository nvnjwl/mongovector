import { badRequest } from './httpError';

export function requireString(obj: unknown, key: string, maxLen = 20_000): string {
  const v = (obj as Record<string, unknown> | undefined)?.[key];
  if (typeof v !== 'string' || !v.trim()) throw badRequest(`${key} is required`);
  if (v.length > maxLen) throw badRequest(`${key} too long (max ${maxLen})`);
  return v.trim();
}

export function optionalString(
  obj: unknown,
  key: string,
  maxLen = 20_000
): string | undefined {
  const v = (obj as Record<string, unknown> | undefined)?.[key];
  if (v == null) return undefined;
  if (typeof v !== 'string') throw badRequest(`${key} must be string`);
  if (v.length > maxLen) throw badRequest(`${key} too long (max ${maxLen})`);
  return v.trim();
}

export function requireNumber(obj: unknown, key: string): number {
  const v = (obj as Record<string, unknown> | undefined)?.[key];
  if (typeof v !== 'number' || Number.isNaN(v)) throw badRequest(`${key} must be number`);
  return v;
}
