import Phaser from 'phaser';
import {loadProgress,type PlayerProgress} from '../core/progression';

const LEVELS=[
  {id:1,name:'First Ride',world:'CITY STREETS'},
  {id:2,name:'Market Rush',world:'CITY STREETS'},
  {id:3,name:'Narrow Turn',world:'CITY STREETS'},
  {id:4,name:'Busy Crossing',world:'CITY STREETS'},
  {id:5,name:'Evening Traffic',world:'CITY STREETS'},
  {id:6,name:'Old Bazaar',world:'OLD CITY'},
  {id:7,name:'Rickshaw Row',world:'OLD CITY'},
  {id:8,name:'Signal Trouble',world:'OLD CITY'},
  {id:9,name:'Festival Crowd',world:'FESTIVAL ROAD'},
  {id:10,name:'Grand Chowk',world:'FESTIVAL ROAD'}
];

export class LevelSelectScene extends Phaser.Scene {
  private progress:PlayerProgress=loadProgress();
  constructor(){super('LevelSelect');}
  create():void{
    this.progress=loadProgress();
    const {width}=this.scale;
    this.cameras.main.setBackgroundColor('#0b1420');
    const bg=this.add.graphics();
    bg.fillGradientStyle(0x0b1420,0x14283a,0x101c29,0x0b1420,1);bg.fillRect(0,0,width,640);
    // Stylised city map: connected roads and district landmarks.
    const roads=this.add.graphics();
    roads.lineStyle(18,0x263b4c,.8);roads.beginPath();roads.moveTo(-20,170);roads.lineTo(100,230);roads.lineTo(260,190);roads.lineTo(390,270);roads.moveTo(40,125);roads.lineTo(115,300);roads.lineTo(250,390);roads.lineTo(330,520);roads.strokePath();
    roads.lineStyle(2,0xfbbf24,.45);roads.beginPath();roads.moveTo(-20,170);roads.lineTo(100,230);roads.lineTo(260,190);roads.lineTo(390,270);roads.moveTo(40,125);roads.lineTo(115,300);roads.lineTo(250,390);roads.lineTo(330,520);roads.strokePath();
    this.add.text(24,28,'‹  BACK',{fontSize:'13px',color:'#fbbf24',fontStyle:'bold'}).setInteractive({useHandCursor:true}).on('pointerdown',()=>this.scene.start('Home'));
    this.add.text(width/2,38,'YOUR CITY',{fontSize:'10px',color:'#8fa6b8',letterSpacing:3}).setOrigin(.5);
    this.add.text(width/2,70,'WORLD MAP',{fontSize:'27px',color:'#f8fafc',fontStyle:'bold'}).setOrigin(.5);
    this.add.text(width/2,101,'Choose a chowk and clear the traffic',{fontSize:'10px',color:'#9db0bf'}).setOrigin(.5);
    const districts=[
      {name:'CITY STREETS',range:'LEVELS 01—05',y:145},
      {name:'OLD CITY',range:'LEVELS 06—08',y:325},
      {name:'FESTIVAL ROAD',range:'LEVELS 09—10',y:505}
    ];
    for(const d of districts){
      this.add.text(24,d.y,d.name,{fontSize:'10px',color:'#f8fafc',fontStyle:'bold',letterSpacing:1}).setDepth(2);
      this.add.text(336,d.y,d.range,{fontSize:'8px',color:'#91a4b4'}).setOrigin(1,0).setDepth(2);
    }
    LEVELS.forEach((level,index)=>{
      const unlocked=level.id<=this.progress.unlockedLevel;
      const completed=this.progress.completedLevels.includes(level.id);
      const col=index%2;
      const x=col===0?101:259;
      const y=index<5?180+Math.floor(index/2)*55:index<8?360+(index-5)*48:540+(index-8)*48;
      const compact=index>=8;
      const w=compact?142:142,h=compact?40:44;
      const card=this.add.rectangle(x,y,w,h,unlocked?0x1b3446:0x101e2a,.96).setStrokeStyle(1,completed?0xfbbf24:unlocked?0x547187:0x293b49).setDepth(3);
      const marker=this.add.circle(x-w/2+15,y,9,completed?0xfbbf24:unlocked?0x38bdf8:0x334657).setDepth(4);
      this.add.text(x-w/2+15,y,completed?'✓':unlocked?String(level.id):'🔒',{fontSize:'9px',color:'#0b1420',fontStyle:'bold'}).setOrigin(.5).setDepth(5);
      this.add.text(x-w/2+30,y-7,level.name,{fontSize:compact?'8px':'9px',color:unlocked?'#f8fafc':'#718394',fontStyle:'bold'}).setDepth(5);
      this.add.text(x+w/2-8,y+8,completed?'★ CLEARED':unlocked?'PLAY':'LOCKED',{fontSize:'7px',color:completed?'#fbbf24':unlocked?'#7dd3fc':'#607487'}).setOrigin(1,.5).setDepth(5);
      if(unlocked){
        card.setInteractive({useHandCursor:true}).on('pointerdown',()=>this.scene.start('Game',{levelId:level.id}));
        marker.setInteractive({useHandCursor:true}).on('pointerdown',()=>this.scene.start('Game',{levelId:level.id}));
      }
    });
    this.add.text(width/2,625,'CLEAR A LEVEL TO UNLOCK THE NEXT',{fontSize:'8px',color:'#7890a4',letterSpacing:1}).setOrigin(.5);
  }
}
