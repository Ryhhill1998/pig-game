'use strict';

// create constants for DOM elements to be selected
const player1El = document.querySelector(".player--0");
const player2El = document.querySelector(".player--1");

const p1ScoreEl = document.getElementById("score--0");
const p2ScoreEl = document.getElementById("score--1");

const p1CurrScoreEl = document.getElementById("current--0");
const p2CurrScoreEl = document.getElementById("current--1");

const diceImgEl1 = document.querySelector(".dice--1");
const diceImgEl2 = document.querySelector(".dice--2");

const buttonsArray = document.querySelectorAll(".btn");
const [newGameBtn, rollDiceBtn, holdScoreBtn] = buttonsArray;
const iconsArray = document.querySelectorAll(".icon");

const infoBtn = document.querySelector(".info");
const closeModalBtn = document.querySelector(".close-modal");

const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");

// --------------- GAME SETUP --------------- //

// create game variables
let diceRoll1, diceRoll2, scores, currentScore, activePlayer, gameOn;

// set initial constraints with reset function
const resetGame = function() {

  hideDice();
  newGameBtn.classList.add("hidden");
  rollDiceBtn.classList.remove("hidden");
  holdScoreBtn.classList.remove("hidden");

  if (activePlayer !== undefined) document.querySelector(`.player--${activePlayer}`).classList.remove("player--winner");

  p1ScoreEl.textContent = p2ScoreEl.textContent = 0;
  p1CurrScoreEl.textContent = p2CurrScoreEl.textContent = 0;
  scores = [0,0];
  currentScore = 0;
  gameOn = true;
  activePlayer = 0;

  player1El.classList.add("player--active");
};

// create functions to change appearance of DOM elements
const hideDice = function() {
  diceImgEl1.classList.add("hidden");
  diceImgEl2.classList.add("hidden");
};

const showDice = function() {
  diceImgEl1.classList.remove("hidden");
  diceImgEl2.classList.remove("hidden");
};

const updateDiceImg = (newImgSrc1, newImgSrc2) => [diceImgEl1.src, diceImgEl2.src] = [newImgSrc1, newImgSrc2];

const updateCurrScore = () => document.getElementById(`current--${activePlayer}`).textContent = currentScore;

const updateScore = () => document.getElementById(`score--${activePlayer}`).textContent = scores[activePlayer];

// create function to switch active player
const switchPlayer = function() {
  currentScore = 0;
  updateCurrScore();
  activePlayer = (activePlayer === 0 ? 1 : 0);
  player1El.classList.toggle("player--active");
  player2El.classList.toggle("player--active");
};

// create function to roll dice and return a number between 1 and 6
const rollDice = () => Math.floor(Math.random() * 6) + 1;

// create function to check if dice roll is not 1 and add to player's current score
const checkDiceRoll = function(diceRoll1, diceRoll2) {
  if (diceRoll1 === 1 && diceRoll2 === 1) {
    scores[activePlayer] = 0;
    updateScore();
    switchPlayer();
  } else if (diceRoll1 === 1 || diceRoll2 === 1) {
    switchPlayer();
  } else {
    currentScore += (diceRoll1 + diceRoll2);
    updateCurrScore();
  }
};

// create function to check winner
const checkPlayerWins = () => scores[activePlayer] >= 100 ? true : false;

// create end game function
const endGame = function() {
  gameOn = false;

  document.querySelector(`.player--${activePlayer}`).classList.add("player--winner");
  document.querySelector(`.player--${activePlayer}`).classList.remove("player--active");
  newGameBtn.classList.remove("hidden");
  rollDiceBtn.classList.add("hidden");
  holdScoreBtn.classList.add("hidden");
  hideDice();

  currentScore = 0;
  updateCurrScore();
};

// --------------- GAME FUNCTIONALITY --------------- //

// initialise game
resetGame();

// add click event listener to roll dice button to change the dice img
rollDiceBtn.addEventListener("click", function() {
  if (!gameOn) return;
  diceRoll1 = rollDice();
  diceRoll2 = rollDice();
  updateDiceImg(`dice-${diceRoll1}.png`, `dice-${diceRoll2}.png`);
  showDice();
  checkDiceRoll(diceRoll1, diceRoll2);
});

// add click event listener to hold button to add current score to player score
holdScoreBtn.addEventListener("click", function() {
  if (!gameOn || currentScore === 0) return;
  scores[activePlayer] += currentScore;
  updateScore();
  if (checkPlayerWins()) {
    endGame();
  } else {
    switchPlayer();
  }
});

// add click event listener to new game button to restart game
newGameBtn.addEventListener("click", resetGame);

// --------------- GAME UI --------------- //

// create increased margin animation between icon and button hovered
for (let i = 0; i < buttonsArray.length; i++) {
  const button = buttonsArray[i];
  const icon = iconsArray[i];
  button.addEventListener("mouseover", function() {
    icon.classList.remove("button-unhovered");
    icon.classList.add("button-hovered");
  });
  button.addEventListener("mouseout", function() {
    icon.classList.remove("button-hovered");
    icon.classList.add("button-unhovered");
  });
}

// create rotate animation for rotate icon in roll dice button
rollDiceBtn.addEventListener("mouseover", function() {
  document.querySelector(".fa-rotate").classList.add("fa-rotate-90");
});

rollDiceBtn.addEventListener("mouseout", function() {
  document.querySelector(".fa-rotate").classList.remove("fa-rotate-90");
});

// create animation for when info button is hovered over
infoBtn.addEventListener("mouseover", function() {
  this.classList.remove("info-unhovered");
  this.classList.add("info-hovered");
});

infoBtn.addEventListener("mouseout", function() {
  this.classList.remove("info-hovered");
  this.classList.add("info-unhovered");
});

// --------------- MODAL WINDOW --------------- //

// functions to show and close modal
const showModal = function() {
  if (modal.classList.contains("hidden")) {
    overlay.classList.remove("hidden");
    modal.classList.remove("hidden");
  }
};

const closeModal = function() {
  if (!modal.classList.contains("hidden")) {
    overlay.classList.add("hidden");
    modal.classList.add("hidden");
  };
};

infoBtn.addEventListener("click", showModal);

closeModalBtn.addEventListener("click", closeModal);

overlay.addEventListener("click", closeModal);

document.addEventListener("keydown", function(event) {
  if (event.key === "Escape") closeModal();
});
