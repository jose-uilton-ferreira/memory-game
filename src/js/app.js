const cards = [
  'angular', 'aurelia', 'backbone', 'linux', 'css', 'ember', 'go', 'html', 'java', 'javascript', 'python',
  'react'
];

const sceneStart = document.querySelector('#scene-start');
const startBtn = document.querySelector('#start-game');

const sceneGame = document.querySelector('#scene-game');
const memoryGame = document.querySelector('#memory-game');

const sceneGameOver = document.querySelector('#scene-game-over');
const tryAgainBtn = document.querySelector('#try-again-game');
sceneGameOver.style.display = 'none';

let gameState = {
  cards: [],
  fisrtCard: null,
  secondCard: null,
  pairsLeft: 0,
  lock: false
};

startBtn.onclick = () => {
  
  restartGame(gameState);

  let dificulty;
  let dificultyOptions = document.querySelectorAll('.dificulty__radio');

  for (let i = 0; i < dificultyOptions.length; i++) {
    if (dificultyOptions[i].checked) {
      dificulty = i;
      break;
    }
  }

  let selectedCards = cards.slice(0, 4 * dificulty + 4);
  selectedCards = [...selectedCards, ...selectedCards];
  shuffle(selectedCards);

  gameState.cards = selectedCards;
  gameState.pairsLeft = selectedCards.length / 2;

  sceneStart.style.display = 'none';
  sceneGame.style.display = 'block';

  createCards(memoryGame, gameState);
  
}

tryAgainBtn.onclick = () => {

  sceneStart.style.display = 'flex';
  sceneGameOver.style.display = 'none';

}

memoryGame.onclick = event => {

  if (gameState.lock) return;

  let cardClicked = event.target.parentNode;

  if (cardClicked.dataset.complete || !cardClicked.classList.contains('memory-game__card')) return;

  if (cardClicked === gameState.fisrtCard) {
    gameState.fisrtCard = null;
    cardClicked.classList.remove('is-flipped');
    return;
  }

  if (gameState.fisrtCard === null) {
    
    gameState.fisrtCard = cardClicked;
    cardClicked.classList.add('is-flipped');

  } else {
    
    gameState.secondCard = cardClicked;
    cardClicked.classList.add('is-flipped');

    if (gameState.fisrtCard.dataset.name === gameState.secondCard.dataset.name) {

      gameState.fisrtCard.dataset.complete = true
      gameState.secondCard.dataset.complete = true

      gameState.fisrtCard = null;
      gameState.secondCard = null;
      gameState.pairsLeft--;

      if (gameState.pairsLeft === 0) {
        setTimeout(() => {
          sceneGame.style.display = 'none';
          sceneGameOver.style.display = 'flex';
        }, 1000);
      }

    } else {

      gameState.lock = true;
      setTimeout(() => {
        gameState.fisrtCard.classList.remove('is-flipped');
        gameState.secondCard.classList.remove('is-flipped');
        gameState.fisrtCard = null;
        gameState.secondCard = null;
        gameState.lock = false;
      }, 1000);

    }

  }

}

function createCards(memoryGame, game) {

  let cardsTemplate = '';

  for (let i = 0; i < game.cards.length; i++) {
    let name = game.cards[i];
    let imageURL = `images/${name}.svg`;

    cardsTemplate += `
      <div class="memory-game__card" data-name="${name}">
        <div class="card__face card__face--front"></div>

        <div class="card__face card__face--back">
          <img src="${imageURL}" class="card__icon">
        </div>
      </div>
    `;
  }

  memoryGame.innerHTML = cardsTemplate;

}

function restartGame(game) {

  game.cards = [];
  game.fisrtCard = null;
  game.secondCard = null;
  game.pairsLeft = 0;

}

function shuffle(array) {

  for (let i = 0; i < array.length; i++) {
    let j = Math.floor(Math.random() * (array.length));
    [ array[i], array[j] ] = [ array[j], array[i] ];
  }

}