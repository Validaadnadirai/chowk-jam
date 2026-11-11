import Phaser from 'phaser';
import type { Vehicle } from '../core/types';

/** Lightweight vector vehicle kit. Draws on the local X axis; lane orientation
 * is applied once at the end so the existing board hitbox and movement stay intact. */
export function createVehicleArt(scene: Phaser.Scene, vehicle: Vehicle, width: number, height: number): Phaser.GameObjects.Container {
  const group = scene.add.container(0, 0);
  const length = Math.max(width, height);
  const depth = Math.min(width, height);
  const color = Phaser.Display.Color.HexStringToColor(vehicle.color).color;
  const dark = 0x17232d;
  const glass = 0x9bd7e8;
  const body = scene.add.graphics();

  group.add(scene.add.ellipse(0, depth * 0.32, length * 0.84, depth * 0.24, 0x071018, 0.34));
  body.fillStyle(dark, 1);
  body.fillRoundedRect(-length * .48, -depth * .36, length * .96, depth * .78, Math.min(9, depth * .2));
  body.fillStyle(color, 1);
  const radius = vehicle.type === 'mini-truck' ? 3 : vehicle.type === 'auto' ? 7 : 9;
  body.fillRoundedRect(-length * .46, -depth * .43, length * .92, depth * .76, radius);
  body.lineStyle(1.5, 0xffffff, .7);
  body.strokeRoundedRect(-length * .46, -depth * .43, length * .92, depth * .76, radius);
  group.add(body);

  const roof = scene.add.graphics();
  roof.fillStyle(0x263746, 1);
  switch (vehicle.type) {
    case 'auto':
      roof.fillRoundedRect(-length*.12,-depth*.5,length*.46,depth*.51,5);
      roof.fillStyle(0xf4c542,1); roof.fillRoundedRect(-length*.1,-depth*.48,length*.4,depth*.12,3);
      roof.fillStyle(glass,1); roof.fillRect(-length*.07,-depth*.31,length*.32,depth*.18);
      break;
    case 'erickshaw':
      roof.fillRoundedRect(-length*.29,-depth*.5,length*.66,depth*.56,4);
      roof.fillStyle(0xe8f4f2,1); roof.fillRoundedRect(-length*.21,-depth*.43,length*.47,depth*.29,3);
      roof.lineStyle(1,0x55717f,1); roof.lineBetween(0,-depth*.42,0,-depth*.15);
      break;
    case 'tempo':
      roof.fillRoundedRect(-length*.43,-depth*.5,length*.73,depth*.58,3);
      roof.fillStyle(0xf5d18b,.95); roof.fillRect(-length*.37,-depth*.39,length*.58,depth*.13);
      roof.fillStyle(glass,1); roof.fillRect(-length*.35,-depth*.2,length*.56,depth*.13);
      break;
    case 'bus':
      roof.fillRoundedRect(-length*.43,-depth*.5,length*.86,depth*.6,5);
      roof.fillStyle(glass,.98);
      for(let i=0;i<4;i++) roof.fillRoundedRect(-length*.36+i*length*.19,-depth*.4,length*.13,depth*.26,2);
      break;
    case 'hatchback':
      roof.fillRoundedRect(-length*.28,-depth*.48,length*.57,depth*.5,7);
      roof.fillStyle(glass,1); roof.fillRoundedRect(-length*.22,-depth*.4,length*.45,depth*.29,5);
      roof.lineStyle(1,0x527080,.8); roof.lineBetween(0,-depth*.39,0,-depth*.12);
      break;
    case 'taxi':
      roof.fillRoundedRect(-length*.28,-depth*.48,length*.58,depth*.5,6);
      roof.fillStyle(glass,1); roof.fillRoundedRect(-length*.22,-depth*.4,length*.45,depth*.28,4);
      roof.fillStyle(0x17232d,1); roof.fillRect(-length*.04,-depth*.56,length*.16,depth*.08);
      roof.fillStyle(0xf8fafc,1); roof.fillRect(-length*.03,-depth*.55,length*.14,depth*.06);
      break;
    case 'mini-truck':
      roof.fillRoundedRect(-length*.45,-depth*.49,length*.48,depth*.56,2);
      roof.fillStyle(glass,1); roof.fillRoundedRect(-length*.4,-depth*.41,length*.23,depth*.25,2);
      roof.fillStyle(0x9b6b3e,1); roof.fillRect(length*.08,-depth*.45,length*.32,depth*.48);
      roof.lineStyle(1,0xf4d4a5,.9); roof.lineBetween(length*.08,-depth*.2,length*.4,-depth*.2);
      break;
  }
  group.add(roof);

  const wheels=scene.add.graphics();
  wheels.fillStyle(0x0b1118,1);
  for(const x of [-.34,.27]) wheels.fillRoundedRect(length*x,depth*.22,Math.max(5,length*.13),depth*.25,2);
  wheels.fillStyle(0x71808b,1);
  wheels.fillCircle(-length*.275,depth*.35,Math.max(1.5,depth*.055));
  wheels.fillCircle(length*.335,depth*.35,Math.max(1.5,depth*.055));
  group.add(wheels);

  const details=scene.add.graphics();
  details.fillStyle(0xfff0b5,1); details.fillRoundedRect(length*.39,-depth*.25,Math.max(3,length*.055),depth*.16,2);
  details.fillStyle(0xe85b4a,1); details.fillRoundedRect(-length*.45,-depth*.23,Math.max(3,length*.05),depth*.15,2);
  details.lineStyle(1,0xffffff,.38); details.lineBetween(-length*.38,depth*.04,length*.37,depth*.04);
  if(vehicle.type==='taxi'){
    details.fillStyle(0x17232d,1); details.fillRect(-length*.22,depth*.12,length*.44,depth*.07);
    for(let i=0;i<5;i++){details.fillStyle(i%2===0?0xf8fafc:0x17232d,1);details.fillRect(-length*.21+i*length*.085,depth*.12,length*.085,depth*.07);}
  }
  group.add(details);
  if(vehicle.type==='auto'){
    group.add(scene.add.circle(-length*.38,depth*.39,Math.max(2,depth*.1),0x111820));
    group.add(scene.add.circle(length*.39,depth*.39,Math.max(2,depth*.1),0x111820));
  }
  const labels:Record<string,string>={auto:'AUTO',erickshaw:'E-RICK',tempo:'TEMPO',bus:'BUS',hatchback:'CITY',taxi:'TAXI', 'mini-truck':'CARGO'};
  if(length>65) group.add(scene.add.text(0,depth*.1,labels[vehicle.type],{
    fontFamily:'Arial, sans-serif',fontSize:'7px',color:'#14212a',fontStyle:'bold',stroke:'#ffffff',strokeThickness:1,
  }).setOrigin(.5));
  group.rotation=vehicle.orientation==='vertical'?Math.PI/2:0;
  return group;
}