import type { GameState } from './types';
export class History {
  private stack: GameState[] = [];
  push(state: GameState): void { this.stack.push(structuredClone(state)); }
  undo(current: GameState): GameState { const previous = this.stack.pop(); return previous ? structuredClone(previous) : current; }
  get canUndo(): boolean { return this.stack.length > 0; }
  clear(): void { this.stack = []; }
}