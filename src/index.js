import Phaser from "phaser";

import { Preload } from "./scenes/preload";

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 300 },
      debug: false,
    },
  },
  parent: "container",
  scene: [Preload],
};

const game = new Phaser.Game(config);
