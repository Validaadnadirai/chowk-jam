import Phaser from 'phaser';
export class SplashScene extends Phaser.Scene {
  constructor(){super('Splash');}
  create():void{
    this.cameras.main.setBackgroundColor('#101923');
    this.add.text(180,250,'CHOWK JAM',{fontFamily:'Arial',fontSize:'34px',color:'#f8fafc',fontStyle:'bold'}).setOrigin(0.5);
    this.add.text(180,300,'Apna chowk, apna challenge!',{fontSize:'15px',color:'#fbbf24'}).setOrigin(0.5);
    this.time.delayedCall(650,()=>this.scene.start('Home'));
  }
}