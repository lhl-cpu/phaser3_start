import Phaser from "phaser";

import { Preload } from "./scenes/preload";

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 200 },
    },
  },
  scene: [Preload],
};

const game = new Phaser.Game(config);
