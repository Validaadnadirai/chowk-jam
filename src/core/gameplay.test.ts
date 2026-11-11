import {describe,it,expect} from 'vitest';
import {createFullGame,attemptVehicleExit,starsForMoves} from './gameplay';
import {signalPhase,isLaneClosed} from './signals';
import {solveLevel} from './solver';
import type {LevelDefinition,Vehicle} from './types';
const v:Vehicle={id:'a',type:'auto',color:'#f00',x:2,y:2,length:1,orientation:'horizontal',facing:'right',seats:1};
const level:LevelDefinition={id:1,name:'test',width:6,height:6,vehicles:[v],obstacles:[]};
describe('full gameplay rules',()=>{
 it('boards a matching passenger and wins after departure',()=>{const s=createFullGame({...level,passengers:['#f00'],par:1});const n=attemptVehicleExit(s,'a');expect(n.result).toBe('won');expect(n.bay).toHaveLength(0);});
 it('does not count a blocked exit',()=>{const s=createFullGame({...level,obstacles:[{x:4,y:2,kind:'barrier'}]});expect(attemptVehicleExit(s,'a').grid.moves).toBe(0);});
 it('fails when the full bay has no matching passenger',()=>{const s=createFullGame({...level,passengers:['#00f'],bayCapacity:1});const n=attemptVehicleExit(s,'a');expect(n.result).toBe('failed');expect(n.failReason).toBe('bay-deadlock');});
 it('blocks a lane while its signal group is red',()=>{const signal={flipEvery:3,lanes:[{orientation:'row' as const,index:2,group:'B' as const}]};const s=createFullGame({...level,signal});expect(attemptVehicleExit(s,'a')).toBe(s);});
 it('flips signal after configured moves',()=>{const signal={flipEvery:3,lanes:[{orientation:'row' as const,index:2,group:'B' as const}]};expect(signalPhase(2,signal)).toBe(0);expect(signalPhase(3,signal)).toBe(1);expect(isLaneClosed(v,0,signal)).toBe(true);});
 it('calculates stars against par',()=>{expect(starsForMoves(10,10)).toBe(3);expect(starsForMoves(12,10)).toBe(2);expect(starsForMoves(14,10)).toBe(1);});
 it('solver finds a one-vehicle solution',()=>{expect(solveLevel(level).moves).toBe(1);});
});
