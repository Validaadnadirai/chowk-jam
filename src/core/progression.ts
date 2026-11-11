export type BoosterId='undo'|'hint'|'extra-slot'|'shuffle';
export interface PlayerProgress { version:1; coins:number; unlockedLevel:number; completedLevels:number[]; inventory:Record<BoosterId,number>; sound:boolean; music:boolean; vibration:boolean; language:'en'|'hi'|'hinglish'; tutorialSeen:boolean }
export const DEFAULT_PROGRESS:PlayerProgress={version:1,coins:100,unlockedLevel:1,completedLevels:[],inventory:{undo:3,hint:3,'extra-slot':1,shuffle:2},sound:true,music:true,vibration:true,language:'en',tutorialSeen:false};
const KEY='chowk-jam.progress.v1';
export function normalizeProgress(value:unknown):PlayerProgress {
 if(!value||typeof value!=='object')return structuredClone(DEFAULT_PROGRESS);
 const v=value as Partial<PlayerProgress>;
 if(v.version!==1)return structuredClone(DEFAULT_PROGRESS);
 const inventory={...DEFAULT_PROGRESS.inventory,...(v.inventory??{})};
 for(const id of Object.keys(inventory) as BoosterId[])inventory[id]=Math.max(0,Math.floor(Number(inventory[id])||0));
 return {...DEFAULT_PROGRESS,...v,coins:Math.max(0,Math.floor(Number(v.coins)||0)),unlockedLevel:Math.max(1,Math.floor(Number(v.unlockedLevel)||1)),completedLevels:Array.isArray(v.completedLevels)?[...new Set(v.completedLevels.filter(Number.isInteger))]:[],inventory};
}
export function loadProgress(storage:Pick<Storage,'getItem'>|undefined=globalThis.localStorage):PlayerProgress {
 try {const raw=storage?.getItem(KEY);return raw?normalizeProgress(JSON.parse(raw)):structuredClone(DEFAULT_PROGRESS);}catch{return structuredClone(DEFAULT_PROGRESS);}
}
export function saveProgress(progress:PlayerProgress,storage:Pick<Storage,'setItem'>|undefined=globalThis.localStorage):void {
 try{storage?.setItem(KEY,JSON.stringify(normalizeProgress(progress)));}catch{/* Storage may be disabled or full; never block play. */}
}
export function awardLevel(progress:PlayerProgress,level:number,stars:1|2|3):PlayerProgress {
 const completed=progress.completedLevels.includes(level);
 const reward=stars*20;
 return {...progress,coins:progress.coins+(completed?Math.floor(reward/2):reward),unlockedLevel:Math.max(progress.unlockedLevel,level+1),completedLevels:completed?progress.completedLevels:[...progress.completedLevels,level]};
}
export function consumeBooster(progress:PlayerProgress,id:BoosterId,cost=0):PlayerProgress|null {
 const count=progress.inventory[id]??0;
 if(count>0)return {...progress,inventory:{...progress.inventory,[id]:count-1}};
 if(progress.coins<cost)return null;
 return {...progress,coins:progress.coins-cost};
}
export function buyBooster(progress:PlayerProgress,id:BoosterId,quantity=1):PlayerProgress|null {
 const prices:Record<BoosterId,number>={undo:25,hint:30,'extra-slot':80,shuffle:20};
 const cost=prices[id]*quantity;
 if(!Number.isInteger(quantity)||quantity<1||progress.coins<cost)return null;
 return {...progress,coins:progress.coins-cost,inventory:{...progress.inventory,[id]:progress.inventory[id]+quantity}};
}
