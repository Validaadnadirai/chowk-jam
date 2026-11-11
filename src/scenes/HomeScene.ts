import Phaser from 'phaser';
import {loadProgress,saveProgress,type PlayerProgress} from '../core/progression';
import {t,type Language} from '../core/localization';

export class HomeScene extends Phaser.Scene {
  private progress:PlayerProgress=loadProgress();
  constructor(){super('Home');}

  create():void{
    const {width,height}=this.scale;
    this.cameras.main.setBackgroundColor('#0b1420');
    const bg=this.add.graphics();
    bg.fillGradientStyle(0x0b1420,0x15283a,0x101c29,0x0b1420,1);
    bg.fillRect(0,0,width,height);
    // Distant Indian-city skyline, intentionally built from a small reusable set of primitives.
    const skyline=this.add.graphics();
    skyline.fillStyle(0x1b3041,.9);
    const buildings=[[-8,230,48,110],[34,195,42,145],[72,220,52,120],[119,178,44,162],[158,212,52,128],[205,188,48,152],[248,218,55,122],[298,190,46,150],[336,225,38,115]];
    for(const [x,y,w,h] of buildings){
      skyline.fillRoundedRect(x,y,w,h,3);
      skyline.fillStyle(0xfbbf24,.24);
      for(let wx=x+8;wx<x+w-5;wx+=14)for(let wy=y+14;wy<y+h-8;wy+=19)skyline.fillRect(wx,wy,4,6);
      skyline.fillStyle(0x1b3041,.9);
    }
    // Road ribbon and centre dashes anchor the game's traffic-jam identity.
    const road=this.add.graphics();
    road.fillStyle(0x101820,1);road.fillRoundedRect(-18,310,width+36,94,14);
    road.lineStyle(2,0xf8fafc,.28);road.lineBetween(0,357,width,357);
    for(let x=12;x<width;x+=42)road.fillRoundedRect(x,354,22,4,2);
    road.fillStyle(0xfbbf24,.9);road.fillRoundedRect(24,306,4,8,2);road.fillRoundedRect(width-28,306,4,8,2);

    this.add.text(width/2,58,'VALIDAAD PRESENTS',{fontSize:'9px',color:'#8fa6b8',letterSpacing:3,fontStyle:'bold'}).setOrigin(.5);
    this.add.text(width/2,104,'CHOWK',{fontSize:'43px',color:'#f8fafc',fontStyle:'bold',fontFamily:'Arial',stroke:'#263d50',strokeThickness:2}).setOrigin(.5);
    this.add.text(width/2,147,'JAM',{fontSize:'43px',color:'#fbbf24',fontStyle:'bold',fontFamily:'Arial'}).setOrigin(.5);
    this.add.text(width/2,184,t(this.progress.language,'subtitle'),{fontSize:'11px',color:'#cbd5e1',align:'center'}).setOrigin(.5);

    const card=this.add.rectangle(width/2,255,306,76,0x142638,.94).setStrokeStyle(1,0x466177);
    card.setDepth(2);
    this.add.text(42,231,'YOUR CITY PROGRESS',{fontSize:'9px',color:'#fbbf24',fontStyle:'bold',letterSpacing:1}).setDepth(3);
    this.add.text(42,258,'LEVEL '+this.progress.unlockedLevel,{fontSize:'19px',color:'#f8fafc',fontStyle:'bold'}).setDepth(3);
    this.add.text(314,262,'◈ '+this.progress.coins,{fontSize:'13px',color:'#fbbf24',fontStyle:'bold'}).setOrigin(1,.5).setDepth(3);
    const completed=this.progress.completedLevels.length;
    this.add.text(42,284,completed+' LEVELS CLEARED',{fontSize:'8px',color:'#9db0bf'}).setDepth(3);

    const play=this.add.text(width/2,458,'▶  '+t(this.progress.language,'play'),{fontSize:'19px',color:'#111923',backgroundColor:'#fbbf24',padding:{x:42,y:15},fontStyle:'bold'}).setOrigin(.5).setInteractive({useHandCursor:true});
    play.on('pointerdown',()=>this.scene.start('LevelSelect'));
    const tutorial=this.add.text(100,520,'HOW TO PLAY',{fontSize:'10px',color:'#f8fafc',backgroundColor:'#22394c',padding:{x:12,y:11}}).setOrigin(.5).setInteractive({useHandCursor:true});
    tutorial.on('pointerdown',()=>this.showTutorial());
    const settings=this.add.text(260,520,'SETTINGS',{fontSize:'10px',color:'#f8fafc',backgroundColor:'#22394c',padding:{x:15,y:11}}).setOrigin(.5).setInteractive({useHandCursor:true});
    settings.on('pointerdown',()=>this.showSettings());
    this.add.text(width/2,602,'MADE FOR THE STREETS OF INDIA',{fontSize:'8px',color:'#7890a4',letterSpacing:2}).setOrigin(.5);
    this.add.text(width/2,620,'A VALIDAAD GAME',{fontSize:'7px',color:'#506779',letterSpacing:2}).setOrigin(.5);
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