import kaboom from "kaboom";

const JUMP_FORCE = 400;
const SPEED = 280;
const PIPE_GAP = 140;

let score = 0;
let highScore = localStorage.getItem("highScore") || 0;

kaboom({
  width: 400,
  height: 400,
  canvas: document.querySelector("#game-canvas"),
  background: [51, 151, 255],
});

loadSprite("bean", "sprites/bean.png");
loadFont("ArcadeClassic", "/fonts/ArcadeClassic.ttf");

const spawnPipes = () => {
  const offset = rand(-50, 50);

  add([
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
    text(`Press left click to restart\nHigh Score: ${highScore}`, {
      size: 24,
      align: "center",
      font: "ArcadeClassic",
    }),
    anchor("center"),
    pos(center()),
  ]);

  add([sprite("bean"), scale(2), pos(200, 120), anchor("center")]);

  onKeyPress("space", () => go("game"));
  onClick(() => go("game"));
});

go("start screen");

scene("game", () => {
  score = 0;
  setGravity(1000);

  const player = add([
    sprite("bean"),
    anchor("center"),
    pos(80, height() / 2),
    area(),
    body(),
  ]);

  const scoreObject = add([
    text("Score: 0", { font: "ArcadeClassic" }),
    pos(10, 10),
    z(100),
  ]);

  loop(1, () => {
    score++;
    if (highScore < score) {
      highScore = score;
      localStorage.setItem("highScore", JSON.stringify(highScore));
    }

    scoreObject.text = `Score ${score}`;
  });

  loop(1.5, () => spawnPipes());

  onUpdate(() => {
    if (player.pos.y > height() + 40 || player.pos.y < -40) {
      go("game over");
    }
  });

  player.onCollide("pipe", () => go("game over"));

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
