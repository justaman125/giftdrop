const startBtn = document.getElementById("start-btn");
const startScreen = document.getElementById("start-screen");
const game = document.getElementById("game");

const player = document.getElementById("player");
const scoreEl = document.getElementById("score");
const timerEl = document.getElementById("timer");

let score = 0;
let timeLeft = 30;
let gameLoop;
let countdown;

startBtn.addEventListener("click", startGame);

function startGame() {
  startScreen.classList.add("hidden");
  game.classList.remove("hidden");

  score = 0;
  timeLeft = 30;
  scoreEl.textContent = score;
  timerEl.textContent = timeLeft;

  gameLoop = setInterval(spawnGift, 600);

  countdown = setInterval(() => {
    timeLeft--;
    timerEl.textContent = timeLeft;

    if (timeLeft <= 0) {
      endGame();
    }
  }, 1000);
}

document.addEventListener("mousemove", e => {
  player.style.left = e.clientX - 45 + "px";
});

function spawnGift() {
  const gift = document.createElement("div");
  gift.className = "gift";
  gift.style.left = Math.random() * window.innerWidth + "px";
  document.body.appendChild(gift);

  let fall = setInterval(() => {
    gift.style.top = (gift.offsetTop + 5) + "px";

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
  alert("Time's up! You scored " + score);
  location.reload();
}
