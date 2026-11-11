import Phaser from 'phaser';
import level1 from '../data/levels/level-1.json';
import level2 from '../data/levels/level-2.json';
import level3 from '../data/levels/level-3.json';
import level4 from '../data/levels/level-4.json';
import level5 from '../data/levels/level-5.json';
import {createGameState,exitVehicle,isWon} from '../core/grid';
import {parseLevel} from '../core/levelLoader';
import {History} from '../core/history';
import type {GameState,LevelDefinition,Vehicle} from '../core/types';
const LEVELS:LevelDefinition[]=[parseLevel(level1),parseLevel(level2),parseLevel(level3),parseLevel(level4),parseLevel(level5)];
const CELL=48,LEFT=36,TOP=150;
export class GameScene extends Phaser.Scene {
  private state!:GameState;
  private history=new History();
  private boardLayer!:Phaser.GameObjects.Container;
  private status!:Phaser.GameObjects.Text;
  private levelTitle!:Phaser.GameObjects.Text;
  constructor(){super('Game');}
  create():void{
    this.state=createGameState(LEVELS[0]);
    this.cameras.main.setBackgroundColor('#101923');
    this.add.text(180,42,'CHOWK JAM',{fontSize:'24px',color:'#f8fafc',fontStyle:'bold'}).setOrigin(0.5);
    this.levelTitle=this.add.text(180,82,'LEVEL 1 • '+LEVELS[0].name.toUpperCase(),{fontSize:'11px',color:'#fbbf24'}).setOrigin(0.5);
    this.status=this.add.text(180,112,'Tap a vehicle to send it out',{fontSize:'12px',color:'#cbd5e1'}).setOrigin(0.5);
    this.boardLayer=this.add.container(0,0);this.drawBoard();
    this.add.text(180,460,'CHOOSE A TEST LEVEL',{fontSize:'10px',color:'#94a3b8'}).setOrigin(0.5);
    LEVELS.forEach((level,index)=>{
      const button=this.add.text(44+index*68,490,String(index+1),{fontSize:'16px',color:'#101923',backgroundColor:'#fbbf24',padding:{x:12,y:8}}).setOrigin(0.5).setInteractive({useHandCursor:true});
      button.on('pointerdown',()=>this.loadSelectedLevel(level));
    });
    const undo=this.add.text(180,540,'↶  UNDO',{fontSize:'16px',color:'#101923',backgroundColor:'#38bdf8',padding:{x:18,y:9}}).setOrigin(0.5).setInteractive({useHandCursor:true});
    undo.on('pointerdown',()=>{if(this.history.canUndo){this.state=this.history.undo(this.state);this.status.setText('Last move undone');this.drawBoard();}});
    const home=this.add.text(180,600,'HOME',{fontSize:'13px',color:'#fbbf24'}).setOrigin(0.5).setInteractive({useHandCursor:true});
    home.on('pointerdown',()=>this.scene.start('Home'));
  }
  private loadSelectedLevel(level:LevelDefinition):void{
    this.state=createGameState(level);this.history.clear();this.levelTitle.setText('LEVEL '+level.id+' • '+level.name.toUpperCase());this.status.setText('Tap a vehicle to send it out');this.drawBoard();
  }
  private drawBoard():void{
    this.boardLayer.removeAll(true);
    for(let y=0;y<this.state.level.height;y++)for(let x=0;x<this.state.level.width;x++)this.boardLayer.add(this.add.rectangle(LEFT+x*CELL+CELL/2,TOP+y*CELL+CELL/2,CELL-3,CELL-3,0x263544).setStrokeStyle(1,0x3c5062));
    for(const obstacle of this.state.level.obstacles){
      const icon=obstacle.kind==='bhains'?'🐃':obstacle.kind==='thela'?'🛒':'🚧';
      this.boardLayer.add(this.add.text(LEFT+obstacle.x*CELL+CELL/2,TOP+obstacle.y*CELL+CELL/2,icon,{fontSize:'23px'}).setOrigin(0.5));
    }
    for(const vehicle of this.state.vehicles)this.drawVehicle(vehicle);
  }
  private drawVehicle(vehicle:Vehicle):void{
    const w=vehicle.orientation==='horizontal'?vehicle.length*CELL-5:CELL-5;
    const h=vehicle.orientation==='vertical'?vehicle.length*CELL-5:CELL-5;
    const px=LEFT+vehicle.x*CELL+(vehicle.orientation==='horizontal'?w/2+2.5:CELL/2);
    const py=TOP+vehicle.y*CELL+(vehicle.orientation==='vertical'?h/2+2.5:CELL/2);
    const rect=this.add.rectangle(px,py,w,h,Phaser.Display.Color.HexStringToColor(vehicle.color).color).setStrokeStyle(2,0xffffff).setInteractive({useHandCursor:true});
    rect.on('pointerdown',()=>{
      const next=exitVehicle(this.state,vehicle.id);
      if(next===this.state){this.status.setText('Blocked! Pehle raasta saaf karo.');return;}
      this.history.push(this.state);this.state=next;
      this.status.setText(isWon(this.state)?'Chowk clear! You win!':'Moves: '+this.state.moves);
      this.drawBoard();
    });
    this.boardLayer.add(rect);
    this.boardLayer.add(this.add.text(px,py,vehicle.type==='erickshaw'?'E-R':vehicle.type.toUpperCase(),{fontSize:'10px',color:'#101923',fontStyle:'bold'}).setOrigin(0.5));
  }
}