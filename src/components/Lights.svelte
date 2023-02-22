<script>
  export const maxGuesses = 8;
  export const winAccuracy = 5;

  let guesses = new Array(maxGuesses).fill(0);
  let currentGuess = 0;

  class Guess {
    constructor(accuracy, emoji, radius, color) {
      this.accuracy = accuracy;
      this.emoji = emoji;
      this.radius = radius;
      this.color = color;
    }
  }

  export const guessMap = {
      0: new Guess(0, "⚪️", null, null),
      1: new Guess(1, "⚫️", null, null),
      2: new Guess(2, "🔴", 750, "#D11716"), 
      3: new Guess(3, "🟠", 500, "#E17F01"), 
      4: new Guess(4, "🟡", 250, "#FED703"), 
      5: new Guess(5, "🟢", 75, "#06AE01")
  }

  export function makeGuess(guess) {
    if (currentGuess < maxGuesses) {
      guesses[currentGuess] = guess;
    }
    currentGuess++;
  };

  export function getGuessAccuracy(milesAway) {
    if (milesAway < guessMap[5].radius) {
      return 5;
    } else if (milesAway < guessMap[4].radius) {
      return 4;
    } else if (milesAway < guessMap[3].radius) {
      return 3;
    } else if (milesAway < guessMap[2].radius) {
      return 2;
    } else {
      return 1;
    }
  }

  export function isGameOver() {
    return currentGuess == maxGuesses || guesses[currentGuess - 1] == winAccuracy
  }

  export function isNewGuess(guess) {
    return !guesses.filter(g => g == guess).length;
  }
</script>

<div class="lights">
  {#each guesses as guess}
    {guessMap[guess].emoji + " "}
  {/each}
</div>

<style>
  .lights {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2.9em;
    padding: 5px;
    border-bottom: 1px solid lightgray;
  }

  @media (max-width: 500px) {
    .lights {
      font-size: 2.2em;
    }
  }
</style>