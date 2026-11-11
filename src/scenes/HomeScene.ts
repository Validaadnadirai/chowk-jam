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
    const progressTrack=this.add.rectangle(width/2,307,276,5,0x30495b,.95).setDepth(3);
    this.add.rectangle(42,307,276*Math.min(1,completed/10),5,0xfbbf24,1).setOrigin(0,.5).setDepth(4);
    progressTrack.setStrokeStyle(1,0x466177,.8);
    this.add.text(width-42,284,completed+'/10',{fontSize:'8px',color:'#fbbf24',fontStyle:'bold'}).setOrigin(1,0).setDepth(3);

    const play=this.add.text(width/2,458,'▶  '+t(this.progress.language,'play'),{fontSize:'19px',color:'#111923',backgroundColor:'#fbbf24',padding:{x:42,y:15},fontStyle:'bold'}).setOrigin(.5).setInteractive(new Phaser.Geom.Rectangle(-150,-32,300,64),Phaser.Geom.Rectangle.Contains);
    play.on('pointerdown',()=>this.scene.start('LevelSelect'));
    const tutorial=this.add.text(100,520,'HOW TO PLAY',{fontSize:'10px',color:'#f8fafc',backgroundColor:'#22394c',padding:{x:12,y:11}}).setOrigin(.5).setInteractive(new Phaser.Geom.Rectangle(-72,-26,144,52),Phaser.Geom.Rectangle.Contains);
    tutorial.on('pointerdown',()=>this.showTutorial());
    const settings=this.add.text(260,520,'SETTINGS',{fontSize:'10px',color:'#f8fafc',backgroundColor:'#22394c',padding:{x:15,y:11}}).setOrigin(.5).setInteractive(new Phaser.Geom.Rectangle(-72,-26,144,52),Phaser.Geom.Rectangle.Contains);
    settings.on('pointerdown',()=>this.showSettings());
    this.add.text(width/2,602,'MADE FOR THE STREETS OF INDIA',{fontSize:'8px',color:'#7890a4',letterSpacing:2}).setOrigin(.5);
    this.add.text(width/2,620,'A VALIDAAD GAME',{fontSize:'7px',color:'#506779',letterSpacing:2}).setOrigin(.5);
  }

  private showTutorial():void{
    const shade=this.add.rectangle(180,320,360,640,0x030912,.78).setDepth(20).setInteractive();
    const panel=this.add.rectangle(180,320,326,430,0x102235,.99).setStrokeStyle(2,0xfbbf24).setDepth(21);
    const eyebrow=this.add.text(180,145,'CHOWK JAM  /  QUICK GUIDE',{fontSize:'8px',color:'#91a9bc',letterSpacing:2,fontStyle:'bold'}).setOrigin(.5).setDepth(22);
    const heading=this.add.text(180,177,'HOW TO PLAY',{fontSize:'22px',color:'#fbbf24',fontStyle:'bold'}).setOrigin(.5).setDepth(22);
    const steps=[
      {n:'01',title:'PICK A VEHICLE',body:'Tap a vehicle to send it toward its exit.'},
      {n:'02',title:'CHECK THE ROAD',body:'Keep its exit lane clear of traffic and obstacles.'},
      {n:'03',title:'MOVE PASSENGERS',body:'Match passengers with the correct vehicle colours.'},
      {n:'04',title:'READ THE SIGNALS',body:'Use the active lane signal to plan your moves.'},
      {n:'05',title:'CLEAR THE CHOWK',body:'Get every vehicle out before you run out of moves.'}
    ];
    const objects:Phaser.GameObjects.GameObject[]=[shade,panel,eyebrow,heading];
    steps.forEach((step,index)=>{
      const y=222+index*57;
      const row=this.add.rectangle(180,y+10,282,48,0x1a3449,.96).setStrokeStyle(1,0x35546b).setDepth(22);
      const number=this.add.text(52,y+10,step.n,{fontSize:'11px',color:'#fbbf24',fontStyle:'bold'}).setOrigin(.5).setDepth(23);
      const title=this.add.text(76,y-3,step.title,{fontSize:'9px',color:'#f8fafc',fontStyle:'bold',letterSpacing:1}).setDepth(23);
      const body=this.add.text(76,y+13,step.body,{fontSize:'8px',color:'#a9bdcc',wordWrap:{width:224}}).setDepth(23);
      objects.push(row,number,title,body);
    });
    const close=this.add.rectangle(180,500,230,42,0xfbbf24,1).setDepth(22).setInteractive({useHandCursor:true});
    const closeText=this.add.text(180,500,'GOT IT  ✓',{fontSize:'12px',color:'#101923',fontStyle:'bold'}).setOrigin(.5).setDepth(23);
    objects.push(close,closeText);
    const dismiss=()=>{objects.forEach(object=>object.destroy());this.progress.tutorialSeen=true;saveProgress(this.progress);};
    close.on('pointerdown',dismiss);
    closeText.setInteractive().on('pointerdown',dismiss);
  }

  private showSettings():void{
    const objects:Phaser.GameObjects.GameObject[]=[];
    const shade=this.add.rectangle(180,320,360,640,0x030912,.78).setDepth(20).setInteractive();
    const panel=this.add.rectangle(180,320,326,430,0x102235,.99).setStrokeStyle(2,0xfbbf24).setDepth(21);
    const eyebrow=this.add.text(180,145,'PERSONALISE YOUR GAME',{fontSize:'8px',color:'#91a9bc',letterSpacing:2,fontStyle:'bold'}).setOrigin(.5).setDepth(22);
    const heading=this.add.text(180,177,'SETTINGS',{fontSize:'22px',color:'#fbbf24',fontStyle:'bold'}).setOrigin(.5).setDepth(22);
    objects.push(shade,panel,eyebrow,heading);
    const addOption=(y:number,label:string,value:()=>string,onToggle:()=>void):void=>{
      const row=this.add.rectangle(180,y,282,52,0x1a3449,.98).setStrokeStyle(1,0x35546b).setDepth(22).setInteractive({useHandCursor:true});
      const name=this.add.text(58,y,label,{fontSize:'10px',color:'#e8f0f6',fontStyle:'bold'}).setOrigin(0,.5).setDepth(23);
      const state=this.add.text(300,y,value(),{fontSize:'9px',color:'#fbbf24',fontStyle:'bold',backgroundColor:'#30485b',padding:{x:9,y:6}}).setOrigin(1,.5).setDepth(23);
      const toggle=()=>{onToggle();state.setText(value());saveProgress(this.progress);};
      row.on('pointerdown',toggle);
      name.setInteractive().on('pointerdown',toggle);
      state.setInteractive().on('pointerdown',toggle);
      objects.push(row,name,state);
    };
    addOption(235,'LANGUAGE',()=>this.progress.language.toUpperCase(),()=>{
      const order:Language[]=['en','hi','hinglish'];
      this.progress.language=order[(order.indexOf(this.progress.language)+1)%order.length];
    });
    addOption(300,'SOUND',()=>this.progress.sound?'ON':'OFF',()=>{this.progress.sound=!this.progress.sound;});
    addOption(365,'MUSIC',()=>this.progress.music?'ON':'OFF',()=>{this.progress.music=!this.progress.music;});
    addOption(430,'VIBRATION',()=>this.progress.vibration?'ON':'OFF',()=>{this.progress.vibration=!this.progress.vibration;});
    const close=this.add.rectangle(180,505,230,42,0xfbbf24,1).setDepth(22).setInteractive({useHandCursor:true});
    const closeText=this.add.text(180,505,'SAVE & CLOSE',{fontSize:'11px',color:'#101923',fontStyle:'bold'}).setOrigin(.5).setDepth(23);
    objects.push(close,closeText);
    const dismiss=()=>objects.forEach(object=>object.destroy());
    close.on('pointerdown',dismiss);
    closeText.setInteractive().on('pointerdown',dismiss);
  }
}
