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

const newGameBtn = document.querySelector(".btn--new");
const rollDiceBtn = document.querySelector(".btn--roll");
const holdScoreBtn = document.querySelector(".btn--hold");

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

const updateDiceImg = function(newImgSrc1, newImgSrc2) {
  diceImgEl1.src = newImgSrc1;
  diceImgEl2.src = newImgSrc2;
};

const updateCurrScore = function() {
  document.getElementById(`current--${activePlayer}`).textContent = currentScore;
};

const updateScore = function() {
  document.getElementById(`score--${activePlayer}`).textContent = scores[activePlayer];
};

// create function to switch active player
const switchPlayer = function() {
  currentScore = 0;
  updateCurrScore();
  activePlayer = (activePlayer === 0 ? 1 : 0);
  player1El.classList.toggle("player--active");
  player2El.classList.toggle("player--active");
};

// create function to roll dice and return a number between 1 and 6
const rollDice = function() {
  return Math.floor(Math.random() * 6) + 1;
};

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
const checkPlayerWins = function() {
  return scores[activePlayer] >= 100 ? true : false;
};

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
  if (!gameOn) return;
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
