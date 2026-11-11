import Phaser from 'phaser';
import { BootScene } from './scenes/BootScene';
import { SplashScene } from './scenes/SplashScene';
import { HomeScene } from './scenes/HomeScene';
import { GameScene } from './scenes/GameScene';
import './style.css';
const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO, parent: 'game-root', backgroundColor: '#101923',
  scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH, width: 360, height: 640 },
  render: { antialias: true, pixelArt: false, roundPixels: false },
  scene: [BootScene, SplashScene, HomeScene, GameScene]
};
new Phaser.Game(config);