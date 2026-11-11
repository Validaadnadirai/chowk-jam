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
    // Three softly tinted map zones establish a visual identity for each district.
    const districtArt=this.add.graphics();
    districtArt.fillStyle(0x1d5261,.17); districtArt.fillRoundedRect(8,126,width-16,174,14);
    districtArt.fillStyle(0x76513a,.16); districtArt.fillRoundedRect(8,306,width-16,174,14);
    districtArt.fillStyle(0x713b55,.17); districtArt.fillRoundedRect(8,486,width-16,128,14);
    // City Streets: modern low-rise skyline and shop awnings.
    districtArt.fillStyle(0x5fa4b7,.28);
    districtArt.fillRect(16,252,22,30); districtArt.fillRect(42,238,17,44); districtArt.fillRect(63,258,25,24);
    districtArt.fillStyle(0xf5c96b,.55);
    for(let i=0;i<4;i++) districtArt.fillRect(18+i*17,265-(i%2)*7,7,3);
    // Old City: warm haveli roofline, arch and minaret silhouette.
    districtArt.fillStyle(0xc18a57,.3);
    districtArt.fillRect(width-46,416,24,42); districtArt.fillTriangle(width-50,416,width-34,400,width-18,416);
    districtArt.fillRect(width-17,392,5,66); districtArt.fillCircle(width-14.5,390,4,0xc18a57,.3);
    districtArt.lineStyle(3,0xd7a66c,.45); districtArt.strokeCircle(width-34,438,8);
    // Festival Road: bunting and glowing festoon points.
    districtArt.lineStyle(1.5,0xf2a6bd,.48); districtArt.beginPath(); districtArt.moveTo(18,520); districtArt.lineTo(width-18,520); districtArt.strokePath();
    for(let i=0;i<9;i++){const x=22+i*(width-44)/8;districtArt.fillStyle(i%2?0xf6cf70:0xf19ab5,.72);districtArt.fillTriangle(x,520,x+5,530,x+10,520);}
    districtArt.fillStyle(0xffd77a,.55); districtArt.fillCircle(width-30,565,4); districtArt.fillCircle(width-52,580,3); districtArt.fillCircle(width-18,592,3);
    districtArt.setDepth(0);
    // Stylised city map: connected roads and district landmarks.
    const roads=this.add.graphics();
    roads.lineStyle(18,0x263b4c,.8);roads.beginPath();roads.moveTo(-20,170);roads.lineTo(100,230);roads.lineTo(260,190);roads.lineTo(390,270);roads.moveTo(40,125);roads.lineTo(115,300);roads.lineTo(250,390);roads.lineTo(330,520);roads.strokePath();
    roads.lineStyle(2,0xfbbf24,.45);roads.beginPath();roads.moveTo(-20,170);roads.lineTo(100,230);roads.lineTo(260,190);roads.lineTo(390,270);roads.moveTo(40,125);roads.lineTo(115,300);roads.lineTo(250,390);roads.lineTo(330,520);roads.strokePath();
    this.add.text(24,28,'‹  BACK',{fontSize:'13px',color:'#fbbf24',fontStyle:'bold'}).setInteractive(new Phaser.Geom.Rectangle(-8,-18,88,44),Phaser.Geom.Rectangle.Contains).on('pointerdown',()=>this.scene.start('Home'));
    this.add.text(width/2,38,'YOUR CITY',{fontSize:'10px',color:'#8fa6b8',letterSpacing:3}).setOrigin(.5);
    this.add.text(width/2,70,'WORLD MAP',{fontSize:'27px',color:'#f8fafc',fontStyle:'bold'}).setOrigin(.5);
    this.add.text(width/2,101,'Choose a chowk and clear the traffic',{fontSize:'10px',color:'#9db0bf'}).setOrigin(.5);
    const districts=[
      {name:'CITY STREETS',range:'LEVELS 01—05',y:145},
      {name:'OLD CITY',range:'LEVELS 06—08',y:325},
      {name:'FESTIVAL ROAD',range:'LEVELS 09—10',y:505}
    ];
    districts.forEach((d, districtIndex)=>{
      // Compact, low-cost district landmarks sit behind the level nodes.
      const landmark=this.add.graphics().setDepth(1);
      if(districtIndex===0){
        // Modern street: shopfront blocks and street lamps.
        for(let i=0;i<4;i++){
          const lx=24+i*82;
          landmark.fillStyle(i%2?0x29495a:0x203d50,.72);
          landmark.fillRoundedRect(lx,d.y+22,42,28,3);
          landmark.fillStyle(0x8bd3e6,.55);landmark.fillRect(lx+6,d.y+28,10,9);landmark.fillRect(lx+24,d.y+28,10,9);
          landmark.fillStyle(0xfbbf24,.7);landmark.fillRect(lx+17,d.y+13,8,3);
        }
      }else if(districtIndex===1){
        // Old bazaar: warm haveli facades, arches and hanging awnings.
        for(let i=0;i<4;i++){
          const lx=24+i*82;
          landmark.fillStyle(0x704b3c,.78);landmark.fillRoundedRect(lx,d.y+22,42,30,2);
          landmark.fillStyle(0xc58b5b,.9);landmark.fillRect(lx+4,d.y+19,34,4);
          landmark.lineStyle(2,0xe9bd83,.8);landmark.strokeCircle(lx+21,d.y+34,7);
          landmark.fillStyle(0x9d5142,.8);landmark.fillTriangle(lx+3,d.y+22,lx+39,d.y+22,lx+21,d.y+29);
        }
      }else{
        // Festival road: colorful pennants, lanterns and a decorated gateway.
        landmark.lineStyle(2,0x9b6bba,.8);landmark.lineBetween(20,d.y+24,350,d.y+24);
        for(let i=0;i<9;i++){
          const px=26+i*39;
          landmark.fillStyle([0xf472b6,0xfbbf24,0x60d6c5][i%3],.9);
          landmark.fillTriangle(px,d.y+24,px+12,d.y+24,px+6,d.y+38);
        }
        landmark.lineStyle(3,0xfbbf24,.8);landmark.strokeRect(154,d.y+38,44,16);
        landmark.fillStyle(0xffd36b,.9);landmark.fillCircle(176,d.y+34,4);
      }
      this.add.text(24,d.y,d.name,{fontSize:'10px',color:'#f8fafc',fontStyle:'bold',letterSpacing:1}).setDepth(2);
      this.add.text(336,d.y,d.range,{fontSize:'8px',color:'#91a4b4'}).setOrigin(1,0).setDepth(2);
    });
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
