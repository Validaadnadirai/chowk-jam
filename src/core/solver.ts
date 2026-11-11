import type { LevelDefinition } from './types';
import { createGameState, exitVehicle, isWon } from './grid';
import { closedSignalCells, type SignalConfig } from './signals';
export interface SolverResult { solvable:boolean; moves:number|null; explored:number }
export function solveLevel(level: LevelDefinition & { signal?: SignalConfig }, maxStates=100000): SolverResult {
  const start=createGameState(level);
  const queue:Array<{ids:string[];moves:number}>= [{ids:start.vehicles.map(v=>v.id),moves:0}];
  const seen=new Set<string>();
  let explored=0;
  while(queue.length && explored<maxStates){
    const node=queue.shift()!;const key=node.ids.slice().sort().join('|')+'#'+(level.signal?Math.floor(node.moves/level.signal.flipEvery)%2:0);
    if(seen.has(key))continue;seen.add(key);explored++;
    const state={...start,vehicles:start.vehicles.filter(v=>node.ids.includes(v.id)),moves:node.moves,exitedIds:start.vehicles.filter(v=>!node.ids.includes(v.id)).map(v=>v.id)};
    if(isWon(state))return {solvable:true,moves:node.moves,explored};
    const closed=closedSignalCells(level,node.moves,level.signal);
    for(const vehicle of state.vehicles){
      const next=exitVehicle(state,vehicle.id,{closedCells:closed});
      if(next!==state)queue.push({ids:next.vehicles.map(v=>v.id),moves:next.moves});
    }
  }
  return {solvable:false,moves:null,explored};
}
