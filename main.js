import kaboom from "kaboom";

const JUMP_FORCE = 380;
const SPEED = 400;
const PIPE_GAP = 140;
const SPAWN_TIME = 0.5;

let score = 0;
let highScore = localStorage.getItem("highScore") || 0;

const k = kaboom({
  width: window.innerWidth > 800 ? 800 : window.innerWidth,
  height: 600,
  canvas: document.querySelector("#game-canvas"),
  background: [51, 151, 255],
});

loadSprite("bean", "sprites/bean.png");
loadFont("ArcadeClassic", "/fonts/ArcadeClassic.ttf");

const spawnPipes = () => {
  const offset = rand(-50, 50);

  const firstPipe = k.add([
    rect(60, 600),
    area(),
    pos(width(), height() / 2 - offset - PIPE_GAP),
    outline(4),
    color(255, 180, 255),
    move(LEFT, SPEED),
    offscreen({ destroy: true }),
    anchor("botleft"),
    "pipe",
  ]);

  add([
    rect(60, PIPE_GAP),
    area(),
    pos(firstPipe.pos),
    move(LEFT, SPEED),
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
    move(LEFT, SPEED),
    offscreen({ destroy: true }),
    "pipe",
  ]);
};

scene("start screen", () => {
  add([
    text(`Hello (●'◡'●)\nClick to start\nHigh Score: ${highScore}`, {
      size: 28,
      align: "center",
      font: "ArcadeClassic",
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

  const scoreObject = add([
    text("Score: 0", { font: "ArcadeClassic" }),
    pos(10, 10),
    z(100),
  ]);

  k.onCollideEnd("player", "gap", () => {
    score++;

    if (highScore < score) {
      highScore = score;
      localStorage.setItem("highScore", JSON.stringify(highScore));
    }

    scoreObject.text = `Score ${score}`;
  });

  loop(SPAWN_TIME, () => spawnPipes());

  onUpdate(() => {
    if (player.pos.y > height() + 40 || player.pos.y < -40) {
      go("game over");
    }
  });

  player.onCollide("pipe", () => {
    go("game over");
  });

  onKeyPress("space", () => player.jump(JUMP_FORCE));
  onClick(() => player.jump(JUMP_FORCE));
});

scene("game over", () => {
  add([
    text(`Game over\n Score: ${score}\nHigh Score: ${highScore}`, {
      font: "ArcadeClassic",
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
