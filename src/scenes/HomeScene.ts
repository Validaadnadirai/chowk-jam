import Phaser from 'phaser';
import {loadProgress,saveProgress,type PlayerProgress} from '../core/progression';
import {t,type Language} from '../core/localization';
export class HomeScene extends Phaser.Scene {
 private progress:PlayerProgress=loadProgress();
 constructor(){super('Home');}
 create():void{
  this.cameras.main.setBackgroundColor('#101923');
  const bg=this.add.graphics();
  bg.fillGradientStyle(0x101923,0x172b3c,0x101923,0x172b3c,1);bg.fillRect(0,0,360,640);
  for(let i=0;i<9;i++){const y=105+i*47;bg.lineStyle(1,0x2d4355,.5);bg.lineBetween(0,y,360,y);}
  this.add.text(180,118,'CHOWK',{fontSize:'39px',color:'#f8fafc',fontStyle:'bold',fontFamily:'Arial'}).setOrigin(.5);
  this.add.text(180,160,'JAM',{fontSize:'39px',color:'#fbbf24',fontStyle:'bold',fontFamily:'Arial'}).setOrigin(.5);
  this.add.text(180,205,t(this.progress.language,'subtitle'),{fontSize:'12px',color:'#cbd5e1'}).setOrigin(.5);
  this.add.rectangle(180,285,290,72,0x203447).setStrokeStyle(1,0x456078);
  this.add.text(180,266,'YOUR CITY IS WAITING',{fontSize:'10px',color:'#fbbf24',fontStyle:'bold'}).setOrigin(.5);
  this.add.text(180,293,'LEVEL '+this.progress.unlockedLevel+'     •     '+t(this.progress.language,'coins')+': '+this.progress.coins,{fontSize:'12px',color:'#f8fafc'}).setOrigin(.5);
  const play=this.add.text(180,385,'▶  '+t(this.progress.language,'play'),{fontSize:'20px',color:'#101923',backgroundColor:'#fbbf24',padding:{x:38,y:15},fontStyle:'bold'}).setOrigin(.5).setInteractive({useHandCursor:true});
  play.on('pointerdown',()=>this.scene.start('Game'));
  const tutorial=this.add.text(180,452,'▣  '+t(this.progress.language,'tutorial'),{fontSize:'13px',color:'#f8fafc',backgroundColor:'#263d50',padding:{x:20,y:10}}).setOrigin(.5).setInteractive();
  tutorial.on('pointerdown',()=>this.showTutorial());
  const settings=this.add.text(180,502,'⚙  '+t(this.progress.language,'settings'),{fontSize:'13px',color:'#f8fafc',backgroundColor:'#263d50',padding:{x:20,y:10}}).setOrigin(.5).setInteractive();
  settings.on('pointerdown',()=>this.showSettings());
  this.add.text(180,590,'MADE FOR THE STREETS OF INDIA',{fontSize:'9px',color:'#7890a4',letterSpacing:2}).setOrigin(.5);
 }
 private showTutorial():void{
  const panel=this.add.rectangle(180,330,320,360,0x0b1520,.98).setStrokeStyle(2,0xfbbf24);
  const heading=this.add.text(180,185,'HOW TO PLAY',{fontSize:'20px',color:'#fbbf24',fontStyle:'bold'}).setOrigin(.5);
  const copy=this.add.text(180,310,'1. Tap a vehicle to send it out.\n\n2. Make sure its exit lane is clear.\n\n3. Match passengers with vehicle colours.\n\n4. Watch the signal lanes.\n\n5. Clear every vehicle to win!',{fontSize:'13px',color:'#f8fafc',align:'left',lineSpacing:7,wordWrap:{width:270}}).setOrigin(.5);
  const close=this.add.text(180,470,'GOT IT',{fontSize:'13px',color:'#101923',backgroundColor:'#fbbf24',padding:{x:22,y:9}}).setOrigin(.5).setInteractive();
  close.on('pointerdown',()=>{panel.destroy();heading.destroy();copy.destroy();close.destroy();this.progress.tutorialSeen=true;saveProgress(this.progress);});
 }
 private showSettings():void{
  const panel=this.add.rectangle(180,330,320,350,0x0b1520,.98).setStrokeStyle(2,0xfbbf24);
  const heading=this.add.text(180,190,'SETTINGS',{fontSize:'20px',color:'#fbbf24',fontStyle:'bold'}).setOrigin(.5);
  const language=this.add.text(180,255,'LANGUAGE: '+this.progress.language.toUpperCase(),{fontSize:'13px',color:'#f8fafc',backgroundColor:'#263d50',padding:{x:15,y:9}}).setOrigin(.5).setInteractive();
  language.on('pointerdown',()=>{const order:Language[]=['en','hi','hinglish'];this.progress.language=order[(order.indexOf(this.progress.language)+1)%order.length];language.setText('LANGUAGE: '+this.progress.language.toUpperCase());saveProgress(this.progress);});
  const sound=this.add.text(180,315,'SOUND: '+(this.progress.sound?'ON':'OFF'),{fontSize:'13px',color:'#f8fafc',backgroundColor:'#263d50',padding:{x:15,y:9}}).setOrigin(.5).setInteractive();
  sound.on('pointerdown',()=>{this.progress.sound=!this.progress.sound;sound.setText('SOUND: '+(this.progress.sound?'ON':'OFF'));saveProgress(this.progress);});
  const music=this.add.text(180,375,'MUSIC: '+(this.progress.music?'ON':'OFF'),{fontSize:'13px',color:'#f8fafc',backgroundColor:'#263d50',padding:{x:15,y:9}}).setOrigin(.5).setInteractive();
  music.on('pointerdown',()=>{this.progress.music=!this.progress.music;music.setText('MUSIC: '+(this.progress.music?'ON':'OFF'));saveProgress(this.progress);});
  const vibration=this.add.text(180,435,'VIBRATION: '+(this.progress.vibration?'ON':'OFF'),{fontSize:'13px',color:'#f8fafc',backgroundColor:'#263d50',padding:{x:15,y:9}}).setOrigin(.5).setInteractive();
  vibration.on('pointerdown',()=>{this.progress.vibration=!this.progress.vibration;vibration.setText('VIBRATION: '+(this.progress.vibration?'ON':'OFF'));saveProgress(this.progress);});
  const close=this.add.text(180,495,'DONE',{fontSize:'13px',color:'#101923',backgroundColor:'#fbbf24',padding:{x:22,y:9}}).setOrigin(.5).setInteractive();
  close.on('pointerdown',()=>{panel.destroy();heading.destroy();language.destroy();sound.destroy();music.destroy();vibration.destroy();close.destroy();});
 }
}
