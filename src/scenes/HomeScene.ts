import Phaser from 'phaser';
export class HomeScene extends Phaser.Scene {
  constructor(){super('Home');}
  create():void{
    this.cameras.main.setBackgroundColor('#101923');
    this.add.text(180,170,'CHOWK JAM',{fontSize:'32px',color:'#f8fafc',fontStyle:'bold'}).setOrigin(0.5);
    this.add.text(180,220,'Traffic ko clear karo!',{fontSize:'17px',color:'#fbbf24'}).setOrigin(0.5);
    const play=this.add.text(180,360,'▶  PLAY',{fontSize:'24px',color:'#101923',backgroundColor:'#fbbf24',padding:{x:28,y:16},fontStyle:'bold'}).setOrigin(0.5).setInteractive({useHandCursor:true});
    play.on('pointerdown',()=>this.scene.start('Game'));
    this.add.text(180,570,'BATCH 1 • CORE ENGINE PREVIEW',{fontSize:'10px',color:'#94a3b8'}).setOrigin(0.5);
  }
}