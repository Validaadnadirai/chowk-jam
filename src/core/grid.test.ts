import {describe,expect,it} from 'vitest';
import {canExit,createGameState,exitVehicle,validateLevel} from './grid';
import {History} from './history';
import type {LevelDefinition,Vehicle} from './types';
const makeVehicle=(facing:Vehicle['facing'],x:number,y:number,length=1):Vehicle=>({id:'v1',type:'auto',color:'#ff0000',x,y,length,orientation:facing==='left'||facing==='right'?'horizontal':'vertical',facing,seats:length});
const makeLevel=(v:Vehicle,obstacles:LevelDefinition['obstacles']=[]):LevelDefinition=>({id:99,name:'Test',width:6,height:6,vehicles:[v],obstacles});
describe('core grid engine',()=>{
  it.each([makeVehicle('right',2,2),makeVehicle('left',2,2),makeVehicle('down',2,2),makeVehicle('up',2,2)])('allows an unobstructed exit in each direction',(v)=>{expect(canExit(createGameState(makeLevel(v)),'v1')).toBe(true);});
  it('blocks a vehicle in another vehicle lane',()=>{const l=makeLevel(makeVehicle('right',0,2));l.vehicles.push({...makeVehicle('up',3,1),id:'blocker'});expect(canExit(createGameState(l),'v1')).toBe(false);});
  it('blocks on static obstacles',()=>{expect(canExit(createGameState(makeLevel(makeVehicle('right',0,2),[{x:4,y:2,kind:'thela'}])),'v1')).toBe(false);});
  it('supports length-three vehicles',()=>{expect(canExit(createGameState(makeLevel(makeVehicle('right',1,1,3))),'v1')).toBe(true);});
  it('does not count blocked taps as moves',()=>{const s=exitVehicle(createGameState(makeLevel(makeVehicle('right',0,2),[{x:4,y:2,kind:'barrier'}])),'v1');expect(s.moves).toBe(0);});
  it('counts successful exits',()=>{const s=exitVehicle(createGameState(makeLevel(makeVehicle('right',2,2))),'v1');expect(s.moves).toBe(1);expect(s.vehicles).toHaveLength(0);});
  it('restores state with undo',()=>{const initial=createGameState(makeLevel(makeVehicle('right',2,2)));const history=new History();history.push(initial);const moved=exitVehicle(initial,'v1');expect(history.undo(moved).vehicles).toHaveLength(1);});
  it('rejects overlapping vehicle and obstacle cells',()=>{expect(()=>validateLevel(makeLevel(makeVehicle('right',1,1),[{x:1,y:1,kind:'bhains'}]))).toThrow();});
});