
let playerCards = [];
let dealerCards = [];
let playerScore = 0;
let dealerScore = 0;
let balance = localStorage.getItem('balance') ? parseInt(localStorage.getItem('balance')) : 10000; 
let currentBet = 0; 

const playerCardsEl = document.getElementById('player-cards');
const dealerCardsEl = document.getElementById('dealer-cards');
const playerScoreEl = document.getElementById('player-score');
const dealerScoreEl = document.getElementById('dealer-score');
const resultEl = document.getElementById('result');
const balanceEl = document.getElementById('balance');
const betInput = document.getElementById('bet');
const betButton = document.getElementById('place-bet');
const hitButton = document.getElementById('hit');
const standButton = document.getElementById('stand');

function getRandomCard() {
  const cards = [2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10, 11];
  return cards[Math.floor(Math.random() * cards.length)];
}


function calculateScore(cards) {
  let score = cards.reduce((sum, card) => sum + card, 0);
 
  cards.forEach(card => {
    if (card === 11 && score > 21) {
      score -= 10;
    }
  });
  return score;
}

function updateDisplay(initial = false) {
  if (initial) {
    playerCardsEl.textContent = `Kartu: -`;
    dealerCardsEl.textContent = `Kartu: -`;
    playerScoreEl.textContent = `Skor: 0`;
    dealerScoreEl.textContent = `Skor: 0`;
  } else {
    playerCardsEl.textContent = `Kartu: ${playerCards.join(', ')}`;
    dealerCardsEl.textContent = `Kartu: ${dealerCards.join(', ')}`;
    playerScoreEl.textContent = `Skor: ${playerScore}`;
    dealerScoreEl.textContent = `Skor: ${dealerScore}`;
  }
  balanceEl.textContent = `Saldo: $${balance}`;
 
  localStorage.setItem('balance', balance);
}

function restartGame() {
  playerCards = [];
  dealerCards = [];
  playerScore = 0;
  dealerScore = 0;
  currentBet = 0;
  resultEl.textContent = '';
  betInput.value = '';
  updateDisplay(true); 
}


function dealerTurn() {
  while (dealerScore < 17) {
    dealerCards.push(getRandomCard());
    dealerScore = calculateScore(dealerCards);
  }
  updateDisplay();
  checkWinner();
}


function checkWinner() {
  if (playerScore > 21) {
    resultEl.textContent = 'Player kalah! Skor melebihi 21.';
    balance -= currentBet;
  } else if (dealerScore > 21 || playerScore > dealerScore) {
    resultEl.textContent = 'Player menang!';
    balance += currentBet;
  } else if (playerScore < dealerScore) {
    resultEl.textContent = 'Dealer menang!';
    balance -= currentBet;
  } else {
    resultEl.textContent = 'Seri! Taruhan dikembalikan.';
  }

  if (balance <= -2000) {
    alert('Saldo Anda habis! Permainan berakhir.');
    return; 
  }

  
  setTimeout(() => {
    restartGame();
  }, 2000);
  updateDisplay(true);
}


function startGame() {
  playerCards = [];
  dealerCards = [];
  playerScore = 0;
  dealerScore = 0;
  resultEl.textContent = '';
  updateDisplay(true);
}

betButton.addEventListener('click', () => {
  const betAmount = parseInt(betInput.value);
  if (isNaN(betAmount) || betAmount <= 0 || betAmount > balance) {
    alert('Masukkan jumlah taruhan yang valid.');
    return;
  }
  currentBet = betAmount;
  startGame();
});

hitButton.addEventListener('click', () => {
  playerCards.push(getRandomCard());
  playerScore = calculateScore(playerCards);
  updateDisplay();
  if (playerScore > 21) {
    checkWinner();
  }
});


standButton.addEventListener('click', () => {
  dealerTurn();
});

updateDisplay(true);
