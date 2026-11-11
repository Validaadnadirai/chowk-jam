import {describe,it,expect} from 'vitest';
import {activateBooster} from './boosters';
import {createFullGame} from './gameplay';
import {DEFAULT_PROGRESS} from './progression';
import type {PlayerProgress} from './progression';
import type {LevelDefinition} from './types';

const level:LevelDefinition={id:1,name:'booster test',width:6,height:6,vehicles:[{id:'auto-1',type:'auto',color:'#f5a623',x:2,y:2,length:1,orientation:'horizontal',facing:'right',seats:1}],obstacles:[]};
const game=()=>createFullGame(level);
const progress=():PlayerProgress=>structuredClone(DEFAULT_PROGRESS);

describe('booster actions',()=>{
 it('adds one waiting-bay slot and consumes the booster',()=>{
  const before=game();const result=activateBooster(before,progress(),'extra-slot');
  expect(result?.state.bayCapacity).toBe(before.bayCapacity+1);
  expect(result?.progress.inventory['extra-slot']).toBe(0);
 });
 it('returns an available vehicle hint without changing the game',()=>{
  const before=game();const result=activateBooster(before,progress(),'hint');
  expect(result?.hintVehicleId).toBe('auto-1');
  expect(result?.state).toBe(before);
 });
 it('does not activate a paid booster when the player cannot afford it',()=>{
  const poor=progress();poor.inventory.hint=0;poor.coins=0;
  expect(activateBooster(game(),poor,'hint',30)).toBeNull();
 });
 it('consumes a free booster before charging coins',()=>{
  const rich=progress();const result=activateBooster(game(),rich,'shuffle',20);
  expect(result?.progress.inventory.shuffle).toBe(1);
  expect(result?.progress.coins).toBe(rich.coins);
 });
});
