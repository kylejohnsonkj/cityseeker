<script>
  let guesses = [0, 0, 0, 0, 0, 0];
  let emojiMap = {0: "⚪️", 1: "🔴", 2: "🟠", 3: "🟡", 4: "🟢"}
  export let round = 0;

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
    {emojiMap[guess] + " "}
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