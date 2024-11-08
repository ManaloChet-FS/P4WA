import './styles.scss';

const cardsWrapper: HTMLElement = document.querySelector(".cards")!;
const attemptsText: HTMLElement = document.querySelector("#attempts")!;
const gameOverSection: HTMLElement = document.querySelector("#gameOver div")!;
const resultText: HTMLParagraphElement = document.querySelector("#result")!;
const startOverBtn: HTMLButtonElement = document.querySelector("button")!;

type Game = {
  attempts: number,
  matchedPairs: number,
  flippedCards: HTMLImageElement[]
}

const game: Game = {
  attempts: 3,
  matchedPairs: 0,
  flippedCards: []
}

const shuffle = (): string[] => {
  const deck: string[] = ['jack', 'jack', 'queen', 'queen', 'king', 'king'];
  const shuffledDeck: string[] = [];

  while (deck.length > 0) {
    // Picks a random card from the deck and puts it into the shuffled deck
    shuffledDeck.push(deck.splice(Math.floor(Math.random() * deck.length), 1)[0]);
  }

  return shuffledDeck;
}

const gameOver = (result: string): void => {
  gameOverSection.style.display = "block";
  resultText.innerText = result;
  document.body.style.pointerEvents = "all";
}

const handleClick = (e: MouseEvent): void => {
  const card = e.target! as HTMLImageElement;
  game.flippedCards.push(card);
  
  // If 2 cards are face up
  if (game.flippedCards.length === 2) {
    document.body.style.pointerEvents = "none";
    // Compare the card's image sources, check if they don't match
    if (game.flippedCards[0].src !== game.flippedCards[1].src) {
      game.attempts -= 1;
      attemptsText.innerText = game.attempts.toString();
      // If there are no more attempts, the player loses
      if (game.attempts === 0) {
        gameOver("You Lose!");
        return;
      }
      // If there are still attempts, wait 1 and a half seconds
      setTimeout((): void => {
        // Flip the cards back over
        game.flippedCards.forEach(card => {
          card.style.transform = "rotateY(180deg)";
          const cardBack: HTMLImageElement = card.previousElementSibling as HTMLImageElement;
          cardBack.style.transform = "rotateY(0deg)";
          card.parentElement!.style.pointerEvents = "all";
          // Half way through the card flip, turn the front of the card invisible
          setTimeout((): void => {
            card.style.opacity = "0";
          }, 500);
        })
        // Clear the flipped cards array
        game.flippedCards = [];
        document.body.style.pointerEvents = "all";
      }, 1500);
    } else {
      // If the cards match
      game.matchedPairs += 1;
      // If you match all 3 pairs
      if (game.matchedPairs === 3) {
        gameOver("You Win!");
      }
      game.flippedCards.forEach(card => {
        // Can't click on matched cards anymore
        card.parentElement!.style.pointerEvents = "none";
      })
      // Clear the flipped cards array
      game.flippedCards = [];
      document.body.style.pointerEvents = "all";
    }
  }
}

const createCards = (): void => {
  cardsWrapper.innerHTML = "";
  const deck = shuffle();

  deck.forEach((card, i) => {
    setTimeout(() => {
      // Create the div that'll hold the front and back of the card
      const div: HTMLDivElement = document.createElement('div');
      div.className = "card";
  
      // Back of the card
      const cardBack: HTMLImageElement = document.createElement('img');
      cardBack.setAttribute("src", "assets/card-flip-card-image.png");
      cardBack.className = "card-back";
      div.append(cardBack);
  
      // Front of the card
      const cardFront: HTMLImageElement = document.createElement('img');
      cardFront.setAttribute("src", `assets/${card}.png`);
      cardFront.className = "card-front";
      div.append(cardFront);
  
      // When clicked, flip the card
      div.addEventListener("click", (e): void => {
        div.style.pointerEvents = "none";
        cardBack.style.transform = "rotateY(180deg)";
        cardFront.style.transform = "rotateY(0deg)";
        setTimeout(() => {
          cardFront.style.opacity = "1";
        }, 500);
        handleClick(e);
      });

      // Add card to DOM
      cardsWrapper!.append(div);
    }, 100 * i)
  })
}

const startGame = () => {
  game.attempts = 3;
  game.matchedPairs = 0;
  game.flippedCards = [];

  attemptsText.innerText = game.attempts.toString();

  createCards();
}

startOverBtn.addEventListener("click", () => {
  gameOverSection.style.display = "none";
  startGame();
});

startGame();