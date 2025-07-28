const cardsArray = ['🐱','🐶','🦊','🐻','🐸','🐵','🐼','🐷','🦁','🐯'];

const gameBoard = document.getElementById('gameBoard');
const moveCounter = document.getElementById('moveCounter');
const timerDisplay = document.getElementById('timer');
const winMessage = document.getElementById('winMessage');

let firstCard = null;
let secondCard = null;
let lockBoard = false;
let moves = 0;
let matchedPairs = 0;
let startTime;
let timerInterval;
let gameStarted = false;

let shuffledCards = [...cardsArray, ...cardsArray].sort(() => 0.5 - Math.random());

function startTimer() {
  startTime = Date.now();
  timerInterval = setInterval(() => {
    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    timerDisplay.textContent = `Time: ${elapsed}s`;
  }, 1000);
}

function createCards() {
  gameBoard.innerHTML = '';
  shuffledCards.forEach(symbol => {
    const card = document.createElement('div');
    card.classList.add('card');
    card.innerHTML = `
      <div class="card-inner">
        <div class="card-front">?</div>
        <div class="card-back">${symbol}</div>
      </div>
    `;
    card.addEventListener('click', () => flipCard(card, symbol));
    gameBoard.appendChild(card);
  });
}

function flipCard(card, symbol) {
  if (lockBoard || card.classList.contains('flipped')) return;

  if (!gameStarted) {
    startTimer();
    gameStarted = true;
  }

  card.classList.add('flipped');

  if (!firstCard) {
    firstCard = { card, symbol };
    return;
  }

  secondCard = { card, symbol };
  lockBoard = true;
  moves++;
  moveCounter.textContent = `Moves: ${moves}`;

  if (firstCard.symbol === secondCard.symbol) {
    matchedPairs++;
    resetTurn();

    if (matchedPairs === cardsArray.length) {
      clearInterval(timerInterval);
      winMessage.classList.remove('hidden');
    }
  } else {
    setTimeout(() => {
      firstCard.card.classList.remove('flipped');
      secondCard.card.classList.remove('flipped');
      resetTurn();
    }, 800);
  }
}

function resetTurn() {
  [firstCard, secondCard] = [null, null];
  lockBoard = false;
}

// 🔁 Restart button logic
document.getElementById('restartBtn').addEventListener('click', resetGame);

function resetGame() {
  clearInterval(timerInterval);
  moveCounter.textContent = 'Moves: 0';
  timerDisplay.textContent = 'Time: 0s';
  winMessage.classList.add('hidden');
  moves = 0;
  matchedPairs = 0;
  gameStarted = false;
  shuffledCards = [...cardsArray, ...cardsArray].sort(() => 0.5 - Math.random());
  createCards();
}

// 🔄 Initial setup
createCards();
