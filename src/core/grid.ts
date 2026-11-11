import type { Cell, Direction, ExitOptions, GameState, LevelDefinition, Vehicle } from './types';
const key = (x: number, y: number): string => x + ',' + y;
const inside = (level: Pick<LevelDefinition, 'width' | 'height'>, x: number, y: number): boolean => x >= 0 && y >= 0 && x < level.width && y < level.height;
export function cellsForVehicle(vehicle: Vehicle): Cell[] {
  return Array.from({ length: vehicle.length }, (_, i) => ({ x: vehicle.x + (vehicle.orientation === 'horizontal' ? i : 0), y: vehicle.y + (vehicle.orientation === 'vertical' ? i : 0) }));
}
export function validateLevel(level: LevelDefinition): void {
  if (!Number.isInteger(level.width) || !Number.isInteger(level.height) || level.width < 1 || level.height < 1) throw new Error('Level dimensions must be positive integers');
  const occupied = new Set<string>();
  for (const obstacle of level.obstacles) {
    if (!inside(level, obstacle.x, obstacle.y)) throw new Error('Obstacle is outside the board');
    const k = key(obstacle.x, obstacle.y);
    if (occupied.has(k)) throw new Error('Overlapping level cells');
    occupied.add(k);
  }
  const ids = new Set<string>();
  for (const vehicle of level.vehicles) {
    if (!vehicle.id || ids.has(vehicle.id)) throw new Error('Vehicle IDs must be unique');
    ids.add(vehicle.id);
    if (!Number.isInteger(vehicle.length) || vehicle.length < 1 || vehicle.length > 3) throw new Error('Vehicle length must be 1–3');
    if (vehicle.orientation === 'horizontal' && vehicle.facing !== 'left' && vehicle.facing !== 'right') throw new Error('Horizontal vehicle needs left/right facing');
    if (vehicle.orientation === 'vertical' && vehicle.facing !== 'up' && vehicle.facing !== 'down') throw new Error('Vertical vehicle needs up/down facing');
    for (const cell of cellsForVehicle(vehicle)) {
      if (!inside(level, cell.x, cell.y)) throw new Error('Vehicle is outside the board');
      const k = key(cell.x, cell.y);
      if (occupied.has(k)) throw new Error('Overlapping level cells');
      occupied.add(k);
    }
  }
}
export function createGameState(level: LevelDefinition): GameState {
  const copy = structuredClone(level);
  validateLevel(copy);
  return { level: copy, vehicles: structuredClone(copy.vehicles), moves: 0, exitedIds: [] };
}
export function canExit(state: GameState, vehicleId: string, options: ExitOptions = {}): boolean {
  const vehicle = state.vehicles.find(v => v.id === vehicleId);
  if (!vehicle) return false;
  const occupied = new Set<string>();
  for (const other of state.vehicles) if (other.id !== vehicleId) for (const cell of cellsForVehicle(other)) occupied.add(key(cell.x, cell.y));
  for (const obstacle of state.level.obstacles) occupied.add(key(obstacle.x, obstacle.y));
  const closed = new Set((options.closedCells ?? []).map(cell => key(cell.x, cell.y)));
  const delta: Record<Direction, Cell> = { up: {x:0,y:-1}, down: {x:0,y:1}, left: {x:-1,y:0}, right: {x:1,y:0} };
  const d = delta[vehicle.facing];
  let x = vehicle.x;
  let y = vehicle.y;
  if (vehicle.facing === 'right') x += vehicle.length - 1;
  if (vehicle.facing === 'down') y += vehicle.length - 1;
  x += d.x; y += d.y;
  while (inside(state.level, x, y)) {
    if (occupied.has(key(x, y)) || closed.has(key(x, y))) return false;
    x += d.x; y += d.y;
  }
  return true;
}
export function exitVehicle(state: GameState, vehicleId: string, options: ExitOptions = {}): GameState {
  if (!canExit(state, vehicleId, options)) return state;
  return { ...state, vehicles: state.vehicles.filter(v => v.id !== vehicleId), moves: state.moves + 1, exitedIds: [...state.exitedIds, vehicleId] };
}
export function isWon(state: GameState): boolean { return state.vehicles.length === 0; }
export function hasMoveLimitFailed(state: GameState): boolean { return state.level.moveLimit !== undefined && state.moves >= state.level.moveLimit && !isWon(state); }