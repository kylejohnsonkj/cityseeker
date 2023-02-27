<script>
  import { writable } from "svelte/store";

  export const maxRounds = 5;
  export const maxGuesses = 8;
  export const winAccuracy = 5;

  export let map;
  export let actions;

  const _guessesGrid = localStorage.getItem('guessesGrid');
  export const guessesGrid = writable(JSON.parse(_guessesGrid) || createGrid());
  guessesGrid.subscribe((value) => {
    // console.log(value);
    localStorage.setItem('guessesGrid', JSON.stringify(value));
  });
  console.table($guessesGrid);

  let currentRound = getCurrentRound();
  let guesses = getGuesses();
  let currentGuess = getCurrentGuess();

  export function getScore() {
    return $guessesGrid.reduce((score, guesses) => {
      const guessesCount = guesses.filter(num => num !== 0).length;
      const penalty = guesses[guesses.length - 1] !== 0 && guesses[guesses.length - 1] !== 5 ? 2 : 0;
      return score + guessesCount + penalty;
    }, 0);
  }

  function getGuesses() {
    if (currentRound == maxRounds) {
      return $guessesGrid[maxRounds - 1];
    }
    return $guessesGrid[currentRound];
  }

  export function getCurrentRound() {
    let round = $guessesGrid.findLastIndex(guesses => guesses[0] !== 0);
    let nextRound = $guessesGrid.findIndex(guesses => guesses[0] == 0);
    return round !== -1 ? round : nextRound !== -1 ? nextRound : maxRounds;
  }

  export function _getCurrentRound() {
    return currentRound;
  }

  function createGrid() {
    const grid = [];
    for (let y = 0; y < maxRounds; y++) {
      grid.push(new Array(maxGuesses).fill(0));
    }
    return grid;
  }

  export function resetForNextRound() {
    currentGuess = 0;
    currentRound++;
    guesses = $guessesGrid[currentRound];
    actions.updateCurrentRound(currentRound);
  }

  export function getGuessesGridAsEmoji() {
    let allEmojis = "";
    for (let i = 0; i < maxRounds; i++) {
      allEmojis += getGuessesAsEmoji($guessesGrid[i]) + "\n";
    }
    return allEmojis;
  }

  function getGuessesAsEmoji(roundGuesses) {
    let emojis = "";
    for (let i = 0; i < maxGuesses; i++) {
      emojis += guessMap[roundGuesses[i]].emoji;
    }
    return emojis;
  }

  export function hasNextRound() {
    return getCurrentRound() < maxRounds - 1;
  }

  export function getRoundScore() {
    return currentGuess + (didFail() ? 2 : 0);
  }

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
    if (currentGuess == 0) {
      map.clearSavedMarkers();
    }
    guesses[currentGuess] = guess;
    $guessesGrid[currentRound] = guesses;
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

  export function getCurrentGuess() {
    if (currentRound == maxRounds) {
      return maxGuesses;
    }
    const index = $guessesGrid[currentRound].indexOf(0);
    return index != -1 ? index : maxGuesses;
  }

  export function getLatestGuessAccuracy() {
    return guesses[currentGuess];
  }

  export function isGameOver() {
    return currentRound == maxRounds || currentGuess == maxGuesses || guesses[currentGuess - 1] == winAccuracy
  }

  export function didFail() {
    return currentGuess == maxGuesses && guesses[currentGuess - 1] != winAccuracy
  }

  export function isBestGuessSoFar(guess) {
    let currentGuesses = guesses.filter(g => g != 0); // all non-zero guesses
    return currentGuesses.filter(g => guess <= g).length == 1;
  }

  export function shouldResetMap() {
    return currentRound == 0 && currentGuess == 0;
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