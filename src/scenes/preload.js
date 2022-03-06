import Phaser from "phaser";

var platforms;
var player;
var cursors;
var stars;
var bombs;
var score = 0;
var scoreText;
var gameOver = false;
export class Preload extends Phaser.Scene {
  constructor() {
    super();
  }

  preload() {
    this.load.setBaseURL("assets");

    this.load.image("sky", "/sky.png");
    this.load.image("ground", "/platform.png");
    this.load.image("star", "/star.png");
    this.load.image("bomb", "/bomb.png");
    //  每个人物的大小
    this.load.spritesheet("dude", "/dude.png", {
      frameWidth: 32,
      frameHeight: 48,
    });
  }

  create() {
    this.add.image(400, 300, "sky");

    //  绑定键盘
    cursors = this.input.keyboard.createCursorKeys();

    // 静态物理组
    platforms = this.physics.add.staticGroup();

    // 显示分数
    scoreText = this.add.text(16, 16, "得分: 0", {
      fontSize: "32px",
      fill: "#000",
    });

    // 添加障碍物
    platforms.create(400, 568, "ground").setScale(2).refreshBody();

    platforms.create(600, 400, "ground");
    platforms.create(50, 250, "ground");
    platforms.create(750, 220, "ground");

    // 添加人物
    player = this.physics.add.sprite(100, 450, "dude");

    // 0.2的弹性
    player.setBounce(0.2);
    // 边缘限定，不能超过边界
    player.setCollideWorldBounds(true);
    // 重力
    player.body.setGravityY(30);

    // 精灵图前四个是向左的动画
    this.anims.create({
      key: "left",
      frames: this.anims.generateFrameNumbers("dude", { start: 0, end: 3 }),
      frameRate: 10,
      repeat: -1, // 一直重复
    });

    // 精灵图转身动画
    this.anims.create({
      key: "turn",
      frames: [{ key: "dude", frame: 4 }],
      frameRate: 20,
    });

    // 精灵图向右动画
    this.anims.create({
      key: "right",
      frames: this.anims.generateFrameNumbers("dude", { start: 5, end: 8 }),
      frameRate: 10,
      repeat: -1,
    });

    // 添加星星
    stars = this.physics.add.group({
      key: "star",
      repeat: 11,
      setXY: { x: 12, y: 0, stepX: 70 },
    });

    stars.children.iterate(function (child) {
      child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
    });

    // 添加几个游戏阻碍
    bombs = this.physics.add.group();

    // 人物与障碍的碰撞
    this.physics.add.collider(player, platforms);
    // 星星与障碍的碰撞
    this.physics.add.collider(stars, platforms);
    // 人物与星星的碰撞
    this.physics.add.overlap(player, stars, collectStar, null, this);
    this.physics.add.collider(bombs, platforms);
    this.physics.add.collider(player, bombs, hitBomb, null, this);
  }

  update() {
    if (!gameOver) {
      if (cursors.left.isDown) {
        player.setVelocityX(-160);

        player.anims.play("left", true);
      } else if (cursors.right.isDown) {
        player.setVelocityX(160);

        player.anims.play("right", true);
      } else if (cursors.down.isDown) {
        // 极速下降
        player.body.setGravityY(1000);
      } else {
        player.setVelocityX(0);

        player.body.setGravityY(30);
        player.anims.play("turn");
      }

      // player.body.touching.down 检测是否接触地面
      if (cursors.up.isDown && player.body.touching.down) {
        player.setVelocityY(-340);
      }
    }
  }
}

// 玩家收集到星星
function collectStar(player, star) {
  star.disableBody(true, true);

  score += 10;
  scoreText.setText("得分: " + score);

  if (stars.countActive(true) === 0) {
    stars.children.iterate(function (child) {
      child.enableBody(true, child.x, 0, true, true);
    });

    // 炸弹生成未知始终位于角色对立面
    var x =
      player.x < 400
        ? Phaser.Math.Between(400, 800)
        : Phaser.Math.Between(0, 400);

    var bomb = bombs.create(x, 16, "bomb");
    bomb.setBounce(1);
    bomb.setCollideWorldBounds(true);
    bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
  }
}

// 玩家碰到了炸弹
function hitBomb(player, bomb) {
  this.physics.pause();

  player.setTint(0xff0000);

  player.anims.play("turn");

  gameOver = true;
}
