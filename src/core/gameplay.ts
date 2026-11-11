import type { GameState, LevelDefinition, Vehicle } from './types';
import { canExit, exitVehicle, isWon } from './grid';
import { closedSignalCells, type SignalConfig } from './signals';
export interface Passenger { id: string; color: string }
export interface BayVehicle { vehicle: Vehicle; boarded: number }
export interface FullGameState {
  grid: GameState; bay: BayVehicle[]; passengerStream: Passenger[]; streamIndex: number;
  bayCapacity: number; signal?: SignalConfig; moveLimit?: number; par: number;
  result: 'playing' | 'won' | 'failed'; failReason?: 'bay-deadlock' | 'move-limit';
}
export function createFullGame(level: LevelDefinition & { passengers?: string[]; bayCapacity?: number; signal?: SignalConfig; par?: number }): FullGameState {
  const colors = level.passengers?.length ? level.passengers : level.vehicles.map(v=>v.color);
  const passengerStream = colors.map((color,i)=>({id:'p'+i,color}));
  return {grid:{level,vehicles:structuredClone(level.vehicles),moves:0,exitedIds:[]},bay:[],passengerStream,streamIndex:0,bayCapacity:level.bayCapacity ?? 5,signal:level.signal,moveLimit:level.moveLimit,par:level.par ?? Math.max(1,level.vehicles.length),result:'playing'};
}
function streamHasColor(state: FullGameState, color: string): boolean { return state.passengerStream.some(p=>p.color===color); }
function settleBay(state: FullGameState): FullGameState {
  let bay=[...state.bay];
  let index=state.streamIndex;
  // A bounded full pass is enough: passengers with no matching waiting vehicle loop around.
  for(let n=0;n<state.passengerStream.length && bay.length;n++){
    const passenger=state.passengerStream[index % state.passengerStream.length];
    const target=bay.findIndex(item=>item.vehicle.color===passenger.color && item.boarded<item.vehicle.seats);
    if(target>=0){const item=bay[target];bay[target]={...item,boarded:item.boarded+1};if(bay[target].boarded>=item.vehicle.seats)bay=bay.filter((_,i)=>i!==target);}
    index=(index+1)%state.passengerStream.length;
  }
  return {...state,bay,streamIndex:index};
}
export function attemptVehicleExit(state: FullGameState, vehicleId: string): FullGameState {
  if(state.result!=='playing') return state;
  const vehicle=state.grid.vehicles.find(v=>v.id===vehicleId);
  if(!vehicle) return state;
  if(state.bay.length>=state.bayCapacity) return state;
  const closed=closedSignalCells(state.grid.level,state.grid.moves,state.signal);
  if(!canExit(state.grid,vehicleId,{closedCells:closed})) return state;
  const nextGrid=exitVehicle(state.grid,vehicleId,{closedCells:closed});
  let next:FullGameState={...state,grid:nextGrid,bay:[...state.bay,{vehicle,boarded:0}]};
  next=settleBay(next);
  if(next.moveLimit!==undefined && next.grid.moves>=next.moveLimit && !isWon(next.grid)) return {...next,result:'failed',failReason:'move-limit'};
  if(isWon(next.grid) && next.bay.length===0) return {...next,result:'won'};
  if(next.bay.length>=next.bayCapacity && next.bay.every(item=>!streamHasColor(next,item.vehicle.color))) return {...next,result:'failed',failReason:'bay-deadlock'};
  return next;
}
export function starsForMoves(moves:number,par:number):1|2|3 { return moves<=par?3:moves<=Math.ceil(par*1.2)?2:1; }
export function levelStatus(state:FullGameState):string {
  if(state.result==='won') return 'CHOWK CLEAR!';
  if(state.result==='failed') return state.failReason==='move-limit'?'MOVE LIMIT REACHED':'BAY DEADLOCK';
  return 'MOVES: '+state.grid.moves+'  •  BAY: '+state.bay.length+'/'+state.bayCapacity;
}
