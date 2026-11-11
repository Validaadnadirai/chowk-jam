import type { LevelDefinition } from './types';
import { validateLevel } from './grid';
export function parseLevel(input: unknown): LevelDefinition {
  if (!input || typeof input !== 'object') throw new Error('Level must be an object');
  const level = input as LevelDefinition;
  if (!Number.isInteger(level.id) || typeof level.name !== 'string' || !Number.isInteger(level.width) || !Number.isInteger(level.height) || !Array.isArray(level.vehicles) || !Array.isArray(level.obstacles)) throw new Error('Level JSON has an invalid shape');
  if (level.par !== undefined && (!Number.isInteger(level.par) || level.par < 1)) throw new Error('Level par must be a positive integer');
  if (level.moveLimit !== undefined && (!Number.isInteger(level.moveLimit) || level.moveLimit < 1)) throw new Error('Move limit must be a positive integer');
  if (level.bayCapacity !== undefined && (!Number.isInteger(level.bayCapacity) || level.bayCapacity < 1)) throw new Error('Bay capacity must be a positive integer');
  if (level.signal && (!Number.isInteger(level.signal.flipEvery) || level.signal.flipEvery < 1 || !Array.isArray(level.signal.lanes))) throw new Error('Signal configuration is invalid');
  validateLevel(level);
  return level;
}
export async function loadLevel(url: string): Promise<LevelDefinition> {
  const response = await fetch(url);
  if (!response.ok) throw new Error('Unable to load level: ' + response.status);
  return parseLevel(await response.json());
}