<script>
  export const maxGuesses = 8;
  let currentGuess = 0;

  export function getCurrentGuess() {
    return currentGuess;
  }

  let guesses = new Array(maxGuesses).fill(0);

  class Guess {
    constructor(emoji, radius, color) {
      this.emoji = emoji;
      this.radius = radius;
      this.color = color;
    }
  }

  export const guessMap = {
      0: new Guess("⚪️", null, null),
      1: new Guess("⚫️", null, null),
      2: new Guess("🔴", 750, "#D11716"), 
      3: new Guess("🟠", 500, "#E17F01"), 
      4: new Guess("🟡", 250, "#FED703"), 
      5: new Guess("🟢", 75, "#06AE01"),
      6: new Guess("🔵", null, null),
  }

  export function makeGuess(guess) {
    if (currentGuess < maxGuesses) {
      guesses[currentGuess] = guess;
    }
    currentGuess++;
  };

  export function hasGuessedBefore(newGuess) {
    console.log(guesses.filter(guess => guess == newGuess))
    return guesses.filter(guess => guess == newGuess).length > 0;
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