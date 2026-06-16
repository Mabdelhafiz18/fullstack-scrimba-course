// Blackjack (simplified single-player vs. the goal of 21)
// Draw cards, sum them, and try to reach 21 without going over.

let cards = [];
let sum = 0;
let chips = 200;
let hasBlackjack = false;
let isAlive = false;

const messageEl = document.getElementById("message");
const sumEl = document.getElementById("sum");
const cardsEl = document.getElementById("cards");
const chipsEl = document.getElementById("chips");
const startBtn = document.getElementById("start-btn");
const drawBtn = document.getElementById("draw-btn");

startBtn.addEventListener("click", startGame);
drawBtn.addEventListener("click", drawCard);

// Aces count as 11 here; face cards (J/Q/K) count as 10.
function getRandomCard() {
  const random = Math.floor(Math.random() * 13) + 1; // 1..13
  if (random === 1) return 11; // Ace
  if (random > 10) return 10;  // Face card
  return random;
}

function startGame() {
  isAlive = true;
  hasBlackjack = false;
  cards = [getRandomCard(), getRandomCard()];
  sum = cards[0] + cards[1];
  drawBtn.disabled = false;
  startBtn.textContent = "Restart";
  renderGame();
}

function drawCard() {
  if (!isAlive || hasBlackjack) return;
  const newCard = getRandomCard();
  cards.push(newCard);
  sum += newCard;
  renderGame();
}

function renderGame() {
  // Render the card faces
  cardsEl.innerHTML = "";
  cards.forEach((card) => {
    const cardEl = document.createElement("div");
    cardEl.className = "card";
    cardEl.textContent = card === 11 ? "A" : card;
    cardsEl.appendChild(cardEl);
  });

  sumEl.textContent = sum;

  // Decide the round's outcome
  if (sum < 21) {
    messageEl.textContent = "Draw a new card? 🎴";
  } else if (sum === 21) {
    messageEl.textContent = "You've got Blackjack! 🎉";
    hasBlackjack = true;
    chips += 100;
    drawBtn.disabled = true;
  } else {
    messageEl.textContent = "You're out of the game! 💥";
    isAlive = false;
    chips -= 50;
    drawBtn.disabled = true;
  }

  chipsEl.textContent = chips;
}
