import type { LevelDefinition } from './types';
import { validateLevel } from './grid';
export function parseLevel(input: unknown): LevelDefinition {
  if (!input || typeof input !== 'object') throw new Error('Level must be an object');
  const level = input as LevelDefinition;
  if (!Number.isInteger(level.id) || typeof level.name !== 'string' || !Number.isInteger(level.width) || !Number.isInteger(level.height) || !Array.isArray(level.vehicles) || !Array.isArray(level.obstacles)) throw new Error('Level JSON has an invalid shape');
  validateLevel(level);
  return level;
}
export async function loadLevel(url: string): Promise<LevelDefinition> {
  const response = await fetch(url);
  if (!response.ok) throw new Error('Unable to load level: ' + response.status);
  return parseLevel(await response.json());
}