import Phaser from 'phaser';
import level1 from '../data/levels/level-1.json';
import {createGameState,exitVehicle,isWon} from '../core/grid';
import {History} from '../core/history';
import type {GameState,Vehicle} from '../core/types';
const CELL=48,LEFT=36,TOP=150;
export class GameScene extends Phaser.Scene {
  private state!:GameState;
  private history=new History();
  private boardLayer!:Phaser.GameObjects.Container;
  private status!:Phaser.GameObjects.Text;
  constructor(){super('Game');}
  create():void{
    this.state=createGameState(level1);
    this.cameras.main.setBackgroundColor('#101923');
    this.add.text(180,42,'CHOWK JAM',{fontSize:'24px',color:'#f8fafc',fontStyle:'bold'}).setOrigin(0.5);
    this.add.text(180,82,'LEVEL 1 • FIRST RIDE',{fontSize:'12px',color:'#fbbf24'}).setOrigin(0.5);
    this.status=this.add.text(180,112,'Tap a vehicle to send it out',{fontSize:'12px',color:'#cbd5e1'}).setOrigin(0.5);
    this.boardLayer=this.add.container(0,0);this.drawBoard();
    const undo=this.add.text(180,525,'↶  UNDO',{fontSize:'18px',color:'#101923',backgroundColor:'#38bdf8',padding:{x:20,y:12}}).setOrigin(0.5).setInteractive({useHandCursor:true});
    undo.on('pointerdown',()=>{if(this.history.canUndo){this.state=this.history.undo(this.state);this.status.setText('Last move undone');this.drawBoard();}});
    const home=this.add.text(180,590,'HOME',{fontSize:'14px',color:'#fbbf24'}).setOrigin(0.5).setInteractive({useHandCursor:true});
    home.on('pointerdown',()=>this.scene.start('Home'));
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