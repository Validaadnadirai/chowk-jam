import {describe,it,expect} from 'vitest';
import level1 from '../data/levels/level-1.json';
import {parseLevel} from './levelLoader';

describe('level loading and validation',()=>{
 it('accepts a valid shipped level',()=>{
  const parsed=parseLevel(level1);
  expect(parsed.id).toBe(1);
  expect(parsed.vehicles).toHaveLength(1);
 });
 it('rejects non-object input',()=>{
  expect(()=>parseLevel(null)).toThrow('Level must be an object');
 });
 it('rejects an invalid level shape',()=>{
  expect(()=>parseLevel({id:1,name:'bad',width:6,height:6,vehicles:'none',obstacles:[]})).toThrow('invalid shape');
 });
 it('rejects invalid move limits before gameplay starts',()=>{
  expect(()=>parseLevel({...level1,moveLimit:0})).toThrow('Move limit must be a positive integer');
 });
 it('rejects invalid signal configuration',()=>{
  expect(()=>parseLevel({...level1,signal:{flipEvery:0,lanes:[]}})).toThrow('Signal configuration is invalid');
 });
});
