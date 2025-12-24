const startScreen = document.getElementById("startScreen");
const gameScreen = document.getElementById("gameScreen");
const endScreen = document.getElementById("endScreen");

const startBtn = document.getElementById("startBtn");
const playAgainBtn = document.getElementById("playAgainBtn");

const gameArea = document.getElementById("gameArea");
const player = document.getElementById("player");

const scoreEl = document.getElementById("score");
const timerEl = document.getElementById("timer");
const finalScoreEl = document.getElementById("finalScore");
const highScoreEl = document.getElementById("highScore");

let score = 0;
let timeLeft = 30;
let spawnInterval;
let timerInterval;
let difficultySettings;
let gifts = [];

const difficulties = {
  easy: { speed: 2, spawn: 900 },
  normal: { speed: 4, spawn: 600 },
  hard: { speed: 6, spawn: 400 }
};

/* Start Game */
startBtn.addEventListener("click", () => {
  const difficulty = document.querySelector('input[name="difficulty"]:checked').value;
  difficultySettings = difficulties[difficulty];
  startScreen.classList.remove("active");
  gameScreen.classList.add("active");
  startGame();
});

playAgainBtn.addEventListener("click", () => {
  endScreen.classList.remove("active");
  startScreen.classList.add("active");
});

/* Game Logic */
function startGame() {
  score = 0;
  timeLeft = 30;
  scoreEl.textContent = "Score: 0";
  timerEl.textContent = "Time: 30";
  gifts.forEach(g => g.remove());
  gifts = [];

  spawnInterval = setInterval(spawnGift, difficultySettings.spawn);
  timerInterval = setInterval(updateTimer, 1000);
}

function endGame() {
  clearInterval(spawnInterval);
  clearInterval(timerInterval);

  const highScore = Math.max(score, localStorage.getItem("catchGiftsHighScore") || 0);
  localStorage.setItem("catchGiftsHighScore", highScore);

  finalScoreEl.textContent = `Final Score: ${score}`;
  highScoreEl.textContent = `High Score: ${highScore}`;

  gameScreen.classList.remove("active");
  endScreen.classList.add("active");
}

function updateTimer() {
  timeLeft--;
  timerEl.textContent = `Time: ${timeLeft}`;
  if (timeLeft <= 0) endGame();
}

/* Gifts */
function spawnGift() {
  const gift = document.createElement("div");
  gift.className = "gift";
  gift.style.left = Math.random() * (window.innerWidth - 40) + "px";
  gift.style.top = "-40px";
  gameArea.appendChild(gift);
  gifts.push(gift);
}

function updateGifts() {
  gifts.forEach((gift, index) => {
    gift.style.top = gift.offsetTop + difficultySettings.speed + "px";

    const giftRect = gift.getBoundingClientRect();
    const playerRect = player.getBoundingClientRect();

    if (
      giftRect.bottom >= playerRect.top &&
      giftRect.left < playerRect.right &&
      giftRect.right > playerRect.left
    ) {
      score++;
      scoreEl.textContent = `Score: ${score}`;
      gift.remove();
      gifts.splice(index, 1);
    }

    if (gift.offsetTop > window.innerHeight) {
      gift.remove();
      gifts.splice(index, 1);
    }
  });

  requestAnimationFrame(updateGifts);
}
updateGifts();

/* Player Controls */
let playerX = window.innerWidth / 2;

document.addEventListener("mousemove", e => {
  playerX = e.clientX;
  movePlayer();
});

document.addEventListener("touchmove", e => {
  playerX = e.touches[0].clientX;
  movePlayer();
});

function movePlayer() {
  const halfWidth = player.offsetWidth / 2;
  const x = Math.max(halfWidth, Math.min(window.innerWidth - halfWidth, playerX));
  player.style.left = x + "px";
}

/* Snow */
const snowContainer = document.getElementById("snow");

for (let i = 0; i < 80; i++) {
  const snowflake = document.createElement("div");
  snowflake.className = "snowflake";
  snowflake.style.left = Math.random() * 100 + "vw";
  snowflake.style.animationDuration = 5 + Math.random() * 5 + "s";
  snowflake.style.animationDelay = Math.random() * 5 + "s";
  snowContainer.appendChild(snowflake);
}
