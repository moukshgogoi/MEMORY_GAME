function getSetFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get("set") || "1";
}

function loadImages(set) {
  const basePath = `images/set${set}/`;

  return [
    basePath + "img1.jpg",
    basePath + "img2.jpg",
    basePath + "img3.jpg",
    basePath + "img4.jpg",
    basePath + "img5.jpg",
    basePath + "img6.jpg",
    basePath + "img7.jpg",
    basePath + "img8.jpg",
    basePath + "img9.jpg",
    basePath + "img10.jpg"
    
  ];
}

const currentSet = getSetFromURL();
const images = loadImages(currentSet);

// NO manual duplication — done in code
function generateCards() {
  const duplicated = [...images, ...images];
  return duplicated.sort(() => Math.random() - 0.5);
}

const board = document.getElementById("gameBoard");
const movesEl = document.getElementById("moves");
const pairsEl = document.getElementById("pairs");
const winMessage = document.getElementById("winMessage");
const setNumberEl = document.getElementById("setNumber");

let firstCard = null;
let secondCard = null;
let lockBoard = false;
let moves = 0;
let matchedPairs = 0;
let hasWon = false;

const totalPairs = images.length;

if (setNumberEl) {
  setNumberEl.textContent = currentSet;
}

function createBoard() {
  board.innerHTML = ""; // clear previous

  const cardsArray = generateCards();

  cardsArray.forEach((imgSrc) => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.dataset.image = imgSrc;

    card.innerHTML = `
      <div class="card-inner">
        <div class="card-front"></div>
        <div class="card-back">
          <img src="${imgSrc}" />
        </div>
      </div>
    `;

    card.addEventListener("click", handleClick);
    board.appendChild(card);
  });
}

function handleClick() {
  if (lockBoard || hasWon) return;
  if (this === firstCard) return;

  this.classList.add("flipped");

  if (!firstCard) {
    firstCard = this;
    return;
  }

  secondCard = this;
  lockBoard = true;
  moves++;
  movesEl.textContent = moves;

  checkMatch();
}

function checkMatch() {
  const isMatch =
    firstCard.dataset.image === secondCard.dataset.image;

  if (isMatch) {
    matchedPairs++;
    pairsEl.textContent = matchedPairs;

    if (matchedPairs === totalPairs) {
      winMessage.classList.remove("hidden");
      hasWon = true;
      lockBoard = true;
    }

    resetTurn();
  } else {
    setTimeout(() => {
      firstCard.classList.remove("flipped");
      secondCard.classList.remove("flipped");
      resetTurn();
    }, 700);
  }
}

function resetTurn() {
  firstCard = null;
  secondCard = null;
  lockBoard = false;
}

function restartGame() {
  firstCard = null;
  secondCard = null;
  lockBoard = false;
  hasWon = false;
  moves = 0;
  matchedPairs = 0;

  movesEl.textContent = 0;
  pairsEl.textContent = 0;
  winMessage.classList.add("hidden");
  createBoard();
}

function goToMenu() {
  window.location.href = "index.html";
}

// INIT
createBoard();
