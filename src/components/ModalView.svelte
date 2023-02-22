<script>
	import Modal from "./Modal.svelte";
  import Button from "./Button.svelte";

  let showHelp;
  let showGameOver;
  let city;
  let didWin;

  export let lights;

	export function toggleHelp() {
		showHelp = !showHelp;
	}
  
  export function gameOver(targetCity, targetDidWin) {
    showGameOver = true;
    city = targetCity;
    didWin = targetDidWin;
  }
</script>

{#if showHelp}
  <Modal on:close="{() => showHelp = false}">
    <h2 slot="header">How To Play</h2>
    <br>
    <b>Guess the location in {lights.maxGuesses} tries</b>
    <ul>
      <li>The location is a city (over 40k) in the continental US</li>
      <li>Your marker color reflects how far away you are</li>
    </ul>
    <br>
    <h3>Legend</h3>
    <div class="bottom">
      <ul class="no-style">
        <li>⚫️ Very Far</li>
        <li>🔴 Far</li>
        <li>🟠 Near</li>
        <li>🟡 Close</li>
        <li>🟢 Found</li>
      </ul>
      <Button text="Start Game" on:click={toggleHelp} />
    </div>
  </Modal>
{/if}

{#if showGameOver}
  <Modal on:close="{() => showGameOver = false}">
    <h2 slot="header">{didWin ? "City Found!" : "Game Over!"}</h2>
    <br>
    <b>{didWin ? "Congratulations" : "Your streak has ended"}</b>
    <br>
    <p>The city was {city.city}, {city.state}</p>
    <p>Population: {city.population.toLocaleString()}</p>
  </Modal>
{/if}

<style>
  .bottom {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  ul {
    padding-left: 30px;
    padding-right: 1px;
  }
  ul.no-style {
    padding-left: 15px;
    list-style: none;
  }
  h2, h3 {
    padding-bottom: 5px;
  }
</style>