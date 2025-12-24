const startBtn = document.getElementById("start-btn");
const playAgainBtn = document.getElementById("play-again-btn");
const difficultySelect = document.getElementById("difficulty");

const startScreen = document.getElementById("start-screen");
const endScreen = document.getElementById("end-screen");
const game = document.getElementById("game");

const player = document.getElementById("player");
const scoreEl = document.getElementById("score");
const timerEl = document.getElementById("timer");
const finalScoreEl = document.getElementById("final-score");
const highScoreEl = document.getElementById("high-score");

const touchArea = document.getElementById("touch-area");

let score = 0;
let timeLeft = 30;
let gameLoop;
let countdown;
let fallSpeed = 5;
let spawnRate = 600;

startBtn.addEventListener("click", startGame);
playAgainBtn.addEventListener("click", restartGame);

function startGame() {
  const difficulty = difficultySelect.value;

  if (difficulty === "easy") {
    fallSpeed = 4;
    spawnRate = 800;
  } else if (difficulty === "normal") {
    fallSpeed = 6;
    spawnRate = 600;
  } else if (difficulty === "hard") {
    fallSpeed = 8;
    spawnRate = 450;
  }

  startScreen.classList.add("hidden");
  endScreen.classList.add("hidden");
  game.classList.remove("hidden");

  score = 0;
  timeLeft = 30;
  scoreEl.textContent = score;
  timerEl.textContent = timeLeft;

  gameLoop = setInterval(spawnGift, spawnRate);

  countdown = setInterval(() => {
    timeLeft--;
    timerEl.textContent = timeLeft;

    if (timeLeft <= 0) {
      endGame();
    }
  }, 1000);
}

/* Desktop movement */
document.addEventListener("mousemove", e => {
  player.style.left = e.clientX - 45 + "px";
});

/* Mobile movement */
touchArea.addEventListener("touchmove", e => {
  const touchX = e.touches[0].clientX;
  player.style.left = touchX - 45 + "px";
});

function spawnGift() {
  const gift = document.createElement("div");
  gift.className = "gift";
  gift.style.left = Math.random() * window.innerWidth + "px";
  document.body.appendChild(gift);

  let fall = setInterval(() => {
    gift.style.top = (gift.offsetTop + fallSpeed) + "px";

    if (gift.offsetTop > window.innerHeight - 80 &&
        Math.abs(gift.offsetLeft - player.offsetLeft) < 70) {
      score++;
      scoreEl.textContent = score;
      gift.remove();
      clearInterval(fall);
    }

    if (gift.offsetTop > window.innerHeight) {
      gift.remove();
      clearInterval(fall);
    }
  }, 20);
}

function endGame() {
  clearInterval(gameLoop);
  clearInterval(countdown);

  game.classList.add("hidden");
  endScreen.classList.remove("hidden");

  finalScoreEl.textContent = "Your score: " + score;

  let highScore = localStorage.getItem("giftHighScore") || 0;

  if (score > highScore) {
    highScore = score;
    localStorage.setItem("giftHighScore", highScore);
  }

  highScoreEl.textContent = "High score: " + highScore;
}

function restartGame() {
  document.querySelectorAll(".gift").forEach(g => g.remove());
  startGame();
}
