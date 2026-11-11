import level1 from '../src/data/levels/level-1.json';
import level2 from '../src/data/levels/level-2.json';
import level3 from '../src/data/levels/level-3.json';
import level4 from '../src/data/levels/level-4.json';
import level5 from '../src/data/levels/level-5.json';
import level6 from '../src/data/levels/level-6.json';
import level7 from '../src/data/levels/level-7.json';
import level8 from '../src/data/levels/level-8.json';
import level9 from '../src/data/levels/level-9.json';
import level10 from '../src/data/levels/level-10.json';
import {parseLevel} from '../src/core/levelLoader';
import {solveLevel} from '../src/core/solver';
import type {LevelDefinition} from '../src/core/types';
const levels=[level1,level2,level3,level4,level5,level6,level7,level8,level9,level10];
let failed=false;
for(const raw of levels){try{const level=parseLevel(raw);const result=solveLevel(level as LevelDefinition & {signal?:LevelDefinition['signal']});if(!result.solvable){console.error('UNSOLVABLE:',level.id);failed=true;}else console.log('OK level',level.id,'par',level.par ?? '-','solver moves',result.moves,'states',result.explored);}catch(error){console.error('INVALID LEVEL:',error);failed=true;}}
if(failed)throw new Error('One or more levels failed validation');
