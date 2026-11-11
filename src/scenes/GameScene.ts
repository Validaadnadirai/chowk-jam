import Phaser from 'phaser';
import level1 from '../data/levels/level-1.json';
import level2 from '../data/levels/level-2.json';
import level3 from '../data/levels/level-3.json';
import level4 from '../data/levels/level-4.json';
import level5 from '../data/levels/level-5.json';
import level6 from '../data/levels/level-6.json';
import level7 from '../data/levels/level-7.json';
import level8 from '../data/levels/level-8.json';
import level9 from '../data/levels/level-9.json';
import level10 from '../data/levels/level-10.json';
import { createFullGame, attemptVehicleExit, levelStatus, starsForMoves, type FullGameState } from '../core/gameplay';
import { parseLevel } from '../core/levelLoader';
import type { LevelDefinition, Vehicle } from '../core/types';
import {loadProgress,saveProgress,awardLevel,buyBooster,type PlayerProgress,type BoosterId} from '../core/progression';
import {activateBooster} from '../core/boosters';
const LEVELS:LevelDefinition[]=[level1,level2,level3,level4,level5,level6,level7,level8,level9,level10].map(parseLevel);
const CELL=48,LEFT=36,TOP=154;
export class GameScene extends Phaser.Scene {
  private state!:FullGameState;
  private history:FullGameState[]=[];
  private boardLayer!:Phaser.GameObjects.Container;
  private status!:Phaser.GameObjects.Text;
  private levelTitle!:Phaser.GameObjects.Text;
  private signalText!:Phaser.GameObjects.Text;
  private bayText!:Phaser.GameObjects.Text;
  private paused=false;
  private audioContext?:AudioContext;
  private musicOscillator?:OscillatorNode;
  private musicGain?:GainNode;
  private soundEnabled=true;
  private lastSignalPhase=0;
  private progress:PlayerProgress=loadProgress();
  constructor(){super('Game');}
  create():void{
    this.cameras.main.setBackgroundColor('#101923');
    this.add.text(180,28,'CHOWK JAM',{fontSize:'24px',color:'#f8fafc',fontStyle:'bold'}).setOrigin(.5);
    this.levelTitle=this.add.text(180,65,'',{fontSize:'11px',color:'#fbbf24'}).setOrigin(.5);
    this.signalText=this.add.text(180,91,'SIGNAL: GREEN',{fontSize:'10px',color:'#86efac'}).setOrigin(.5);
    this.status=this.add.text(180,115,'',{fontSize:'11px',color:'#cbd5e1'}).setOrigin(.5);
    const sound=this.add.text(318,115,'SOUND ON',{fontSize:'9px',color:'#fbbf24'}).setOrigin(.5).setInteractive();
    sound.on('pointerdown',()=>{this.soundEnabled=!this.soundEnabled;sound.setText(this.soundEnabled?'SOUND ON':'SOUND OFF');if(this.soundEnabled)this.startAmbient();else if(this.musicGain&&this.audioContext)this.musicGain.gain.setTargetAtTime(0,this.audioContext.currentTime,.08);});
    this.boardLayer=this.add.container(0,0);
    this.add.text(180,455,'WAITING BAY',{fontSize:'10px',color:'#fbbf24',fontStyle:'bold'}).setOrigin(.5);
    this.bayText=this.add.text(180,480,'',{fontSize:'12px',color:'#f8fafc'}).setOrigin(.5);
    this.add.text(180,515,'PASSENGER STREAM',{fontSize:'9px',color:'#94a3b8'}).setOrigin(.5);
    this.add.text(180,500,'COINS: '+this.progress.coins,{fontSize:'11px',color:'#fbbf24'}).setOrigin(.5);
    this.add.text(180,550,'SELECT LEVEL',{fontSize:'9px',color:'#94a3b8'}).setOrigin(.5);
    LEVELS.forEach((level,index)=>{
      const x=22+index*35;
      const button=this.add.text(x,575,String(index+1),{fontSize:'12px',color:'#101923',backgroundColor:'#fbbf24',padding:{x:8,y:6}}).setOrigin(.5).setInteractive({useHandCursor:true});
      button.on('pointerdown',()=>this.loadLevel(level));
    });
    const undo=this.add.text(85,620,'↶ UNDO',{fontSize:'12px',color:'#38bdf8'}).setOrigin(.5).setInteractive();
    undo.on('pointerdown',()=>{if(this.history.length){this.state=this.history.pop()!;this.refresh();this.playTone(420,70);}});
    const pause=this.add.text(180,620,'Ⅱ PAUSE',{fontSize:'12px',color:'#f8fafc'}).setOrigin(.5).setInteractive();
    pause.on('pointerdown',()=>{this.paused=!this.paused;this.status.setText(this.paused?'PAUSED — TAP PAUSE TO RESUME':levelStatus(this.state));});
    const home=this.add.text(278,620,'HOME',{fontSize:'12px',color:'#fbbf24'}).setOrigin(.5).setInteractive();
    home.on('pointerdown',()=>this.scene.start('Home'));
    this.addBoosterButton(48,600,'HINT','hint',30);
    this.addBoosterButton(136,600,'+ BAY','extra-slot',80);
    this.addBoosterButton(224,600,'SHUFFLE','shuffle',20);
    this.addBoosterButton(312,600,'UNDO','undo',25);
    this.loadLevel(LEVELS[0]);
  }
  private loadLevel(level:LevelDefinition):void{
    this.state=createFullGame(level);this.history=[];this.paused=false;this.lastSignalPhase=0;this.levelTitle.setText('LEVEL '+level.id+' • '+level.name.toUpperCase());this.refresh();
  }
  private refresh():void{
    this.boardLayer.removeAll(true);
    const boardW=this.state.grid.level.width*CELL,boardH=this.state.grid.level.height*CELL;
    this.boardLayer.add(this.add.rectangle(LEFT+boardW/2,TOP+boardH/2,boardW+18,boardH+18,0x111c27).setStrokeStyle(2,0x526579));
    for(let y=0;y<this.state.grid.level.height;y++)for(let x=0;x<this.state.grid.level.width;x++){
      const tile=this.add.rectangle(LEFT+x*CELL+CELL/2,TOP+y*CELL+CELL/2,CELL-2,CELL-2,0x293846).setStrokeStyle(1,0x3a4b5b);
      this.boardLayer.add(tile);
      if((x+y)%2===0){const dash=this.add.rectangle(LEFT+x*CELL+CELL/2,TOP+y*CELL+CELL/2,2,8,0x91a4b5,.12);this.boardLayer.add(dash);}
    }
    for(const obstacle of this.state.grid.level.obstacles)this.drawObstacle(obstacle);
    for(const vehicle of this.state.grid.vehicles)this.drawVehicle(vehicle);
    const bay=this.state.bay.map(item=>item.vehicle.type.toUpperCase()+' '+item.boarded+'/'+item.vehicle.seats).join('   ');
    this.bayText.setText(bay||'— EMPTY —');
    const colors=this.state.passengerStream.map((p,i)=>this.add.circle(48+i*22,535,6,Phaser.Display.Color.HexStringToColor(p.color).color));
    colors.forEach(circle=>{this.boardLayer.add(circle);this.tweens.add({targets:circle,x:circle.x-18,duration:900,repeat:-1,ease:'Linear'});});
    this.status.setText(levelStatus(this.state));
    const signal=this.state.signal,phase=signal?Math.floor(this.state.grid.moves/signal.flipEvery)%2:0;
    if(signal&&phase!==this.lastSignalPhase){this.tweens.add({targets:this.signalText,scale:1.15,duration:110,yoyo:true});this.playTone(360,65);}
    this.lastSignalPhase=phase;
    this.signalText.setText(signal?'SIGNAL: '+(phase===0?'A OPEN • B CLOSED':'B OPEN • A CLOSED')+'  NEXT '+(phase===0?'B':'A'):'SIGNAL: NOT ACTIVE');
    this.signalText.setColor(this.state.result==='failed'?'#f87171':'#86efac');
    if(this.state.result==='won')this.showResult(true);
    if(this.state.result==='failed')this.showResult(false);
  }
  private drawObstacle(obstacle:import('../core/types').Obstacle):void{
    const cx=LEFT+obstacle.x*CELL+CELL/2,cy=TOP+obstacle.y*CELL+CELL/2;
    const group=this.add.container(cx,cy);
    group.add(this.add.ellipse(0,15,38,9,0x080e14,.5));
    if(obstacle.kind==='bhains'){
      group.add(this.add.ellipse(0,1,36,25,0x252b32).setStrokeStyle(1,0x718096));
      group.add(this.add.ellipse(-11,-5,12,11,0x343c46));group.add(this.add.ellipse(11,-5,12,11,0x343c46));
      group.add(this.add.triangle(-13,-12,-8,-9,-18,-19,0xe2e8f0));group.add(this.add.triangle(13,-12,8,-9,18,-19,0xe2e8f0));
      group.add(this.add.ellipse(0,7,18,12,0x111827));group.add(this.add.circle(-5,1,2,0xfbbf24));group.add(this.add.circle(5,1,2,0xfbbf24));
    }else if(obstacle.kind==='thela'){
      group.add(this.add.rectangle(0,1,30,19,0xb77932).setStrokeStyle(2,0xf5c06a));
      group.add(this.add.rectangle(0,-8,32,5,0x7c3f22));group.add(this.add.circle(-11,14,4,0x111827));group.add(this.add.circle(11,14,4,0x111827));
      group.add(this.add.circle(-7,-2,4,0xfbbf24));group.add(this.add.circle(4,-2,4,0x65a30d));
    }else{
      group.add(this.add.rectangle(0,1,34,22,0xf8fafc).setStrokeStyle(1,0xcbd5e1));
      for(let i=-1;i<=1;i++)group.add(this.add.rectangle(i*10,1,6,22,0xef4444));
      group.add(this.add.circle(-13,-13,3,0xfbbf24));group.add(this.add.circle(13,-13,3,0xfbbf24));
    }
    this.boardLayer.add(group);
  }
  private addBoosterButton(x:number,y:number,label:string,id:BoosterId,cost:number):void{
    const button=this.add.text(x,y,label,{fontSize:'9px',color:'#f8fafc',backgroundColor:'#263d50',padding:{x:6,y:6}}).setOrigin(.5).setInteractive();
    button.on('pointerdown',()=>{if(this.paused||this.state.result!=='playing')return;let next=this.progress;if(next.inventory[id]===0){const purchased=buyBooster(next,id,1);if(!purchased){this.status.setText('NOT ENOUGH COINS');return;}next=purchased;}const result=activateBooster(this.state,next,id,cost);if(!result){this.status.setText('NOT ENOUGH COINS');return;}this.progress=result.progress;this.state=result.state;saveProgress(this.progress);if(id==='undo'&&this.history.length)this.state=this.history.pop()!;if(result.hintVehicleId){const v=this.state.grid.vehicles.find(item=>item.id===result.hintVehicleId);if(v){const ring=this.add.circle(LEFT+v.x*CELL+CELL/2,TOP+v.y*CELL+CELL/2,22).setStrokeStyle(3,0xfbbf24);this.tweens.add({targets:ring,alpha:0,scale:1.8,duration:650,onComplete:()=>ring.destroy()});}}this.refresh();});
  }
  private drawVehicle(vehicle:Vehicle):void{
    const horizontal=vehicle.orientation==='horizontal';
    const w=horizontal?vehicle.length*CELL-7:CELL-9,h=horizontal?CELL-9:vehicle.length*CELL-7;
    const px=LEFT+vehicle.x*CELL+(horizontal?w/2+3.5:CELL/2),py=TOP+vehicle.y*CELL+(horizontal?CELL/2:h/2+3.5);
    const color=Phaser.Display.Color.HexStringToColor(vehicle.color).color;
    const group=this.add.container(px,py).setSize(w,h).setInteractive(new Phaser.Geom.Rectangle(-w/2,-h/2,w,h),Phaser.Geom.Rectangle.Contains);
    group.add(this.add.roundedRect?.(0,0,w,h,10,color)??this.add.rectangle(0,0,w,h,color));
    group.add(this.add.roundedRect?.(0,0,w-5,h-5,9,color)??this.add.rectangle(0,0,w-5,h-5,color));
    group.add(this.add.ellipse(0,h*.38,w*.82,7,0x050b11,.35));
    const side=horizontal?w:h;
    const windowCount=Math.max(1,Math.floor((side-20)/19));
    for(let i=0;i<windowCount;i++){
      const pos=-side/2+14+i*((side-28)/Math.max(1,windowCount-1));
      const win=horizontal?this.add.roundedRect?.(pos,-h*.18,13,Math.max(8,h*.34),3,0x9bd3e8)??this.add.rectangle(pos,-h*.18,13,Math.max(8,h*.34),0x9bd3e8):this.add.roundedRect?.(-w*.18,pos,Math.max(8,w*.34),13,3,0x9bd3e8)??this.add.rectangle(-w*.18,pos,Math.max(8,w*.34),13,0x9bd3e8);
      group.add(win);
    }
    const front=vehicle.facing==='right'?1:vehicle.facing==='left'?-1:vehicle.facing==='down'?1:-1;
    const fx=horizontal?front*w*.39:0,fy=horizontal?0:front*h*.39;
    group.add(this.add.circle(fx-(horizontal?0:0),fy,4,0xfff3b0));
    if(vehicle.type==='bus'||vehicle.type==='tempo'){
      const roof=horizontal?this.add.rectangle(0,h*.13,w*.72,5,0x172b3c,.55):this.add.rectangle(w*.13,0,5,h*.72,0x172b3c,.55);group.add(roof);
    }
    if(vehicle.type==='erickshaw'||vehicle.type==='auto'){
      group.add(this.add.circle(horizontal?0:-w*.3,horizontal?-h*.27:0,5,0x171d24));
      group.add(this.add.rectangle(0,0,w*.23,h*.72,0xfef3c7,.5));
    }
    const wheelPositions=[-.34,.34];
    for(const p of wheelPositions){
      const wx=horizontal?p*w:0,wy=horizontal?0:p*h;
      group.add(this.add.roundedRect?.(wx-horizontal?0:0,wy,8,12,3,0x111827)??this.add.rectangle(wx,wy,8,12,0x111827));
    }
    group.add(this.add.text(0,0,vehicle.type==='erickshaw'?'E-R':vehicle.type.toUpperCase(),{fontSize:'8px',color:'#101923',fontStyle:'bold',stroke:'#ffffff',strokeThickness:1}).setOrigin(.5));
    group.on('pointerdown',()=>{
      if(this.paused||this.state.result!=='playing')return;
      const next=attemptVehicleExit(this.state,vehicle.id);
      if(next===this.state){this.tweens.add({targets:group,x:px+5,y:py,duration:45,yoyo:true,repeat:2});this.playTone(130,90);if('vibrate' in navigator)navigator.vibrate?.(35);return;}
      this.history.push(structuredClone(this.state));
      this.tweens.add({targets:group,alpha:0,scaleX:.75,scaleY:.75,duration:180,onComplete:()=>{this.state=next;this.playTone(520,80);if('vibrate' in navigator)navigator.vibrate?.(18);this.refresh();}});
    });
    this.boardLayer.add(group);
  }
  private startAmbient():void{
    if(!this.soundEnabled)return;
    try{
      this.audioContext??=new AudioContext();
      if(this.musicOscillator&&this.musicGain){this.musicGain.gain.setTargetAtTime(.003,this.audioContext.currentTime,.08);return;}
      this.musicOscillator=this.audioContext.createOscillator();this.musicGain=this.audioContext.createGain();
      this.musicOscillator.type='sine';this.musicOscillator.frequency.value=110;this.musicGain.gain.value=.003;
      this.musicOscillator.connect(this.musicGain);this.musicGain.connect(this.audioContext.destination);this.musicOscillator.start();
    }catch{/* Ambient audio is optional. */}
  }
  private playTone(frequency:number,duration:number):void{
    if(!this.soundEnabled)return;
    try{this.audioContext??=new AudioContext();this.startAmbient();const oscillator=this.audioContext.createOscillator();const gain=this.audioContext.createGain();oscillator.frequency.value=frequency;gain.gain.setValueAtTime(.035,this.audioContext.currentTime);gain.gain.exponentialRampToValueAtTime(.001,this.audioContext.currentTime+duration/1000);oscillator.connect(gain);gain.connect(this.audioContext.destination);oscillator.start();oscillator.stop(this.audioContext.currentTime+duration/1000);}catch{/* Audio is optional; gameplay remains available without it. */}
  }
  private showResult(won:boolean):void{
    const title=won?'CHOWK CLEAR!':'TRY AGAIN';
    this.playTone(won?880:165,won?260:220);
    if('vibrate' in navigator)navigator.vibrate?.(won?[45,35,90]:[90,45,90]);
    if(won)for(let i=0;i<28;i++){const bit=this.add.rectangle(Phaser.Math.Between(42,318),Phaser.Math.Between(180,250),Phaser.Math.Between(3,6),Phaser.Math.Between(5,10),Phaser.Display.Color.GetColor(Phaser.Math.Between(80,255),Phaser.Math.Between(80,255),Phaser.Math.Between(80,255)));this.tweens.add({targets:bit,y:Phaser.Math.Between(340,420),x:bit.x+Phaser.Math.Between(-45,45),angle:Phaser.Math.Between(-180,180),alpha:0,duration:Phaser.Math.Between(650,1050),onComplete:()=>bit.destroy()});}
    if(won){this.progress=awardLevel(this.progress,this.state.grid.level.id,starsForMoves(this.state.grid.moves,this.state.par));saveProgress(this.progress);}
    const stars=won?'★'.repeat(starsForMoves(this.state.grid.moves,this.state.par)):'';
    const panel=this.add.rectangle(180,300,270,120,0x0b1220,.96).setStrokeStyle(2,won?0xfbbf24:0xf87171);
    const text=this.add.text(180,278,title+'\\n'+stars+'\\n'+(won?'MOVES: '+this.state.grid.moves:'REASON: '+this.state.failReason),{fontSize:'18px',color:'#f8fafc',align:'center',lineSpacing:8}).setOrigin(.5);
    const action=this.add.text(180,340,won?'NEXT LEVEL':'RETRY',{fontSize:'12px',color:'#101923',backgroundColor:'#fbbf24',padding:{x:14,y:8}}).setOrigin(.5).setInteractive();
    action.on('pointerdown',()=>{if(won){const next=LEVELS.find(level=>level.id===this.state.grid.level.id+1);if(next)this.loadLevel(next);else this.loadLevel(LEVELS[0]);}else this.loadLevel(LEVELS.find(level=>level.id===this.state.grid.level.id)!);});
    this.boardLayer.add([panel,text,action]);
  }
}
