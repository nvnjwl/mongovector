export type MemoryType =
  | 'preference'
  | 'fact'
  | 'goal'
  | 'relationship'
  | 'project'
  | 'note'
  | 'education';

export const memoryTypes: MemoryType[] = [
  'preference',
  'fact',
  'goal',
  'relationship',
  'project',
  'note',
  'education',
];

export function normalizeMemoryType(type: string | undefined): MemoryType {
  if (!type) return 'note';
  return memoryTypes.includes(type as MemoryType) ? (type as MemoryType) : 'note';
}
