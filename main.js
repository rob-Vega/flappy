import kaboom from "kaboom";
import * as dat from "dat.gui";

var gui = new dat.GUI();

const settings = {
  jumpForce: 380,
  speed: 400,
  pipeGap: 140,
  spawnTime: 1,
};

gui.add(settings, "jumpForce", 300, 500).name("Jump Force");
gui.add(settings, "speed", 100, 1000).name("Speed");
gui.add(settings, "pipeGap", 100, 200).name("Pipe Gap");
gui.add(settings, "spawnTime", 0.3, 2).name("Spawn Time");

gui.close();

let score = 0;
let highScore = localStorage.getItem("highScore") || 0;

const k = kaboom({
  width: window.innerWidth > 800 ? 800 : window.innerWidth,
  height: 600,
  canvas: document.querySelector("#game-canvas"),
  background: [51, 151, 255],
});

loadSprite("bean", "sprites/bean.png");

const spawnPipes = () => {
  const offset = rand(-50, 50);

  const firstPipe = add([
    rect(60, 600),
    area(),
    pos(width(), height() / 2 - offset - settings.pipeGap),
    outline(4),
    color(255, 180, 255),
    move(LEFT, settings.speed),
    offscreen({ destroy: true }),
    anchor("botleft"),
    "pipe",
  ]);

  add([
    rect(60, settings.pipeGap),
    area(),
    pos(firstPipe.pos),
    move(LEFT, settings.speed),
    color(51, 151, 255),
    z(-1),
    offscreen({ destroy: true }),
    "gap",
  ]);

  add([
    rect(60, 600),
    area(),
    pos(width(), height() / 2 - offset),
    outline(4),
    color(255, 180, 255),
    move(LEFT, settings.speed),
    offscreen({ destroy: true }),
    "pipe",
  ]);
};

scene("start screen", () => {
  add([
    text(`Hello (●'◡'●)\nClick to start\nHigh Score: ${highScore}`, {
      size: 28,
      align: "center",
    }),
    anchor("center"),
    pos(width() / 2, height() / 2),
  ]);

  add([
    sprite("bean"),
    scale(2),
    pos(width() / 2, height() / 2 - 120),
    anchor("center"),
  ]);

  onKeyPress("space", () => go("game"));
  onClick(() => go("game"));
});

scene("game", () => {
  score = 0;
  setGravity(1000);

  const player = add([
    sprite("bean"),
    anchor("center"),
    pos(80, height() / 2),
    area(),
    body(),
    "player",
  ]);

  const scoreObject = add([text("Score: 0"), pos(10, 10), z(100)]);

  onCollideEnd("player", "gap", () => {
    score++;

    if (highScore < score) {
      highScore = score;
      localStorage.setItem("highScore", JSON.stringify(highScore));
    }

    scoreObject.text = `Score ${score}`;
  });

  loop(settings.spawnTime, () => spawnPipes());

  onUpdate(() => {
    if (player.pos.y > height() + 40 || player.pos.y < -40) {
      go("game over");
    }
  });

  player.onCollide("pipe", () => {
    go("game over");
  });

  onKeyPress("space", () => player.jump(settings.jumpForce));
  onClick(() => player.jump(settings.jumpForce));
});

scene("game over", () => {
  add([
    text(`Game over\n Score: ${score}\nHigh Score: ${highScore}`, {
      align: "center",
    }),
    anchor("center"),
    pos(center()),
    z(100),
  ]);

  onKeyPress("space", () => go("game"));
  onClick(() => go("game"));

  onKeyPress("escape", () => go("start screen"));
});

go("start screen");
