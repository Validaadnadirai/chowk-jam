import type { Cell, Direction, GameState, LevelDefinition, Vehicle } from './types';
export interface SignalLane { orientation: 'row' | 'column'; index: number; group: 'A' | 'B' }
export interface SignalConfig { flipEvery: number; lanes: SignalLane[] }
export function signalPhase(moves: number, config?: SignalConfig): 0 | 1 { return config && config.flipEvery > 0 ? (Math.floor(moves / config.flipEvery) % 2) as 0 | 1 : 0; }
export function isLaneClosed(vehicle: Vehicle, moves: number, config?: SignalConfig): boolean {
  if (!config) return false;
  const phase = signalPhase(moves, config);
  const laneIndex = vehicle.orientation === 'horizontal' ? vehicle.y : vehicle.x;
  const orientation = vehicle.orientation === 'horizontal' ? 'row' : 'column';
  const lane = config.lanes.find(item => item.orientation === orientation && item.index === laneIndex);
  return !!lane && lane.group === (phase === 0 ? 'B' : 'A');
}
export function nextSignalPhase(moves: number, config?: SignalConfig): 0 | 1 { return signalPhase(moves + 1, config); }
export function closedSignalCells(level: LevelDefinition, moves: number, config?: SignalConfig): Cell[] {
  if (!config) return [];
  const phase = signalPhase(moves, config);
  const closedGroup = phase === 0 ? 'B' : 'A';
  const cells: Cell[] = [];
  for (const lane of config.lanes) if (lane.group === closedGroup) {
    if (lane.orientation === 'row') for (let x=0;x<level.width;x++) cells.push({x,y:lane.index});
    else for (let y=0;y<level.height;y++) cells.push({x:lane.index,y});
  }
  return cells;
}
export function canVehicleUseSignal(state: GameState, vehicleId: string, config?: SignalConfig): boolean {
  const vehicle = state.vehicles.find(item => item.id === vehicleId);
  return !!vehicle && !isLaneClosed(vehicle, state.moves, config);
}
