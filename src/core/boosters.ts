import type {FullGameState} from './gameplay';
import {consumeBooster,type BoosterId,type PlayerProgress} from './progression';
export interface BoosterResult {state:FullGameState;progress:PlayerProgress;hintVehicleId?:string}
export function activateBooster(state:FullGameState,progress:PlayerProgress,id:BoosterId,affordableCost=0):BoosterResult|null {
 const nextProgress=consumeBooster(progress,id,affordableCost);if(!nextProgress)return null;
 if(id==='extra-slot')return {state:{...state,bayCapacity:state.bayCapacity+1},progress:nextProgress};
 if(id==='shuffle')return {state:{...state,passengerStream:[...state.passengerStream].sort(()=>Math.random()-.5)},progress:nextProgress};
 if(id==='hint'){const vehicle=state.grid.vehicles.find(v=>{const {canExit}=({} as typeof import('./grid'));return v.id!=='';});return {state,progress:nextProgress,hintVehicleId:vehicle?.id};}
 return {state,progress:nextProgress};
}
