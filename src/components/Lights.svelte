<script>
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
      2: new Guess("🔴", 1200, "#D11716"), 
      3: new Guess("🟠", 750, "#E17F01"), 
      4: new Guess("🟡", 300, "#FED703"), 
      5: new Guess("🟢", 75, "#06AE01")
  }

  let guesses = [0, 0, 0, 0, 0, 0];
  let round = 0;

  export function makeGuess(guess) {
    if (round == 6) {
      return; // game over
    }
    guesses[round] = guess;
    round++;
    return round
  };
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
</style>