import Phaser from 'phaser';
import type { Vehicle } from '../core/types';

/**
 * Small, reusable vector vehicle kit. All vehicles are drawn along the local
 * X axis and rotated for vertical lanes, keeping the board hitbox untouched.
 */
export function createVehicleArt(scene: Phaser.Scene, vehicle: Vehicle, width: number, height: number): Phaser.GameObjects.Container {
  const group = scene.add.container(0, 0);
  const length = Math.max(width, height);
  const depth = Math.min(width, height);
  const color = Phaser.Display.Color.HexStringToColor(vehicle.color).color;
  const dark = 0x18232b;
  const glass = 0x9bd7e8;
  const vertical = vehicle.orientation === 'vertical';
  const bodyY = 0;

  group.add(scene.add.ellipse(0, depth * 0.31, length * 0.82, depth * 0.25, 0x071018, 0.32));

  const body = scene.add.graphics();
  body.fillStyle(dark, 1);
  body.fillRoundedRect(-length * 0.47, -depth * 0.36, length * 0.94, depth * 0.78, Math.min(9, depth * 0.2));
  body.fillStyle(color, 1);
  body.fillRoundedRect(-length * 0.45, -depth * 0.42, length * 0.9, depth * 0.76, Math.min(8, depth * 0.18));
  body.lineStyle(1.5, 0xffffff, 0.72);
  body.strokeRoundedRect(-length * 0.45, -depth * 0.42, length * 0.9, depth * 0.76, Math.min(8, depth * 0.18));
  group.add(body);

  // Each supported class has its own silhouette and roof treatment.
  const roof = scene.add.graphics();
  roof.fillStyle(0x263746, 1);
  if (vehicle.type === 'auto') {
    roof.fillRoundedRect(-length * 0.13, -depth * 0.5, length * 0.47, depth * 0.5, 5);
    roof.fillStyle(0xf4c542, 1);
    roof.fillRoundedRect(-length * 0.1, -depth * 0.48, length * 0.4, depth * 0.12, 3);
  } else if (vehicle.type === 'erickshaw') {
    roof.fillRoundedRect(-length * 0.28, -depth * 0.49, length * 0.64, depth * 0.55, 4);
    roof.fillStyle(0xe8f4f2, 1);
    roof.fillRoundedRect(-length * 0.2, -depth * 0.43, length * 0.45, depth * 0.3, 3);
  } else if (vehicle.type === 'tempo') {
    roof.fillRoundedRect(-length * 0.43, -depth * 0.48, length * 0.72, depth * 0.56, 3);
    roof.fillStyle(0xf5d18b, 0.95);
    roof.fillRect(-length * 0.37, -depth * 0.38, length * 0.58, depth * 0.12);
  } else {
    roof.fillRoundedRect(-length * 0.4, -depth * 0.49, length * 0.8, depth * 0.58, 5);
    roof.fillStyle(glass, 0.95);
    for (let i = 0; i < 3; i++) roof.fillRoundedRect(-length * 0.31 + i * length * 0.22, -depth * 0.39, length * 0.15, depth * 0.25, 2);
  }
  group.add(roof);

  // Wheel pairs, bumpers and lamps make the silhouettes readable at phone scale.
  const wheel = scene.add.graphics();
  wheel.fillStyle(0x0b1118, 1);
  wheel.fillRoundedRect(-length * 0.34, depth * 0.22, Math.max(5, length * 0.13), depth * 0.25, 2);
  wheel.fillRoundedRect(length * 0.2, depth * 0.22, Math.max(5, length * 0.13), depth * 0.25, 2);
  wheel.fillStyle(0x71808b, 1);
  wheel.fillCircle(-length * 0.275, depth * 0.35, Math.max(1.5, depth * 0.055));
  wheel.fillCircle(length * 0.265, depth * 0.35, Math.max(1.5, depth * 0.055));
  group.add(wheel);

  const detail = scene.add.graphics();
  detail.fillStyle(0xfff0b5, 1);
  detail.fillRoundedRect(length * 0.38, -depth * 0.25, Math.max(3, length * 0.055), depth * 0.16, 2);
  detail.fillStyle(0xe85b4a, 1);
  detail.fillRoundedRect(-length * 0.44, -depth * 0.23, Math.max(3, length * 0.05), depth * 0.15, 2);
  detail.lineStyle(1, 0xffffff, 0.38);
  detail.lineBetween(-length * 0.38, depth * 0.04, length * 0.37, depth * 0.04);
  group.add(detail);

  if (vehicle.type === 'auto') {
    group.add(scene.add.circle(-length * 0.38, depth * 0.39, Math.max(2, depth * 0.1), 0x111820));
    group.add(scene.add.circle(length * 0.39, depth * 0.39, Math.max(2, depth * 0.1), 0x111820));
  }

  const label = vehicle.type === 'erickshaw' ? 'E-RICK' : vehicle.type.toUpperCase();
  if (length > 65) {
    group.add(scene.add.text(0, depth * 0.1, label, {
      fontFamily: 'Arial, sans-serif', fontSize: '7px', color: '#14212a',
      fontStyle: 'bold', stroke: '#ffffff', strokeThickness: 1,
    }).setOrigin(0.5));
  }
  group.rotation = vertical ? Math.PI / 2 : 0;
  group.setPosition(0, bodyY);
  return group;
}
