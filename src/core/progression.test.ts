import {describe,it,expect} from 'vitest';
import {DEFAULT_PROGRESS,normalizeProgress,awardLevel,buyBooster,consumeBooster} from './progression';
describe('player progression',()=>{
 it('restores defaults for invalid or old save data',()=>{expect(normalizeProgress({version:99}).coins).toBe(100);});
 it('unlocks the next level and awards coins only once at full reward',()=>{const won=awardLevel(DEFAULT_PROGRESS,1,3);expect(won.unlockedLevel).toBe(2);expect(won.coins).toBe(160);expect(awardLevel(won,1,3).coins).toBe(190);});
 it('buys boosters only when affordable',()=>{expect(buyBooster({...DEFAULT_PROGRESS,coins:0},'hint')).toBeNull();expect(buyBooster(DEFAULT_PROGRESS,'hint')?.inventory.hint).toBe(4);});
 it('consumes free inventory before coins',()=>{expect(consumeBooster(DEFAULT_PROGRESS,'undo')?.inventory.undo).toBe(2);});
});
