export type Direction = 'up' | 'down' | 'left' | 'right';
export type Orientation = 'horizontal' | 'vertical';
export type VehicleType = 'auto' | 'erickshaw' | 'tempo' | 'bus' | 'hatchback' | 'taxi' | 'mini-truck';
export interface Cell { x: number; y: number }
export interface Vehicle { id: string; type: VehicleType; color: string; x: number; y: number; length: number; orientation: Orientation; facing: Direction; seats: number }
export interface Obstacle extends Cell { kind: 'thela' | 'bhains' | 'barrier' }
export interface SignalLane { orientation: 'row' | 'column'; index: number; group: 'A' | 'B' }
export interface SignalConfig { flipEvery: number; lanes: SignalLane[] }
export interface LevelDefinition { id: number; name: string; width: number; height: number; moveLimit?: number; par?: number; bayCapacity?: number; passengers?: string[]; signal?: SignalConfig; vehicles: Vehicle[]; obstacles: Obstacle[] }
export interface GameState { level: LevelDefinition; vehicles: Vehicle[]; moves: number; exitedIds: string[] }
export interface ExitOptions { closedCells?: Cell[] }