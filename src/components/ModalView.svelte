<script>
	import Modal from "./Modal.svelte";
  import Button from "./Button.svelte";

  let showHelp;
  let showGameOver;
  let city;
  let didWin;

	export function toggleHelp() {
		showHelp = !showHelp;
		console.log(showHelp);
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
    <b>Guess the location in 6 tries</b>
    <ul>
      <li>The location is a city (over 40k) in the continental US</li>
      <li>Your marker color reflects how far away you are</li>
    </ul>
    <br>
    <h3>Legend</h3>
    <ul class="no-style">
      <li>🔴 Far</li>
      <li>🟠 Near</li>
      <li>🟡 Close</li>
      <li>🟢 Found</li>
    </ul>
  </Modal>
{/if}

{#if showGameOver}
  <Modal on:close="{() => showGameOver = false}">
    <h2 slot="header">{didWin ? "You Won" : "Game Over"}</h2>
    <br>
    <b>{didWin ? "Congratulations!" : "Sorry!"}</b>
    <br>
    <p>The city was {city.city}, {city.regionCode}.</p>
    <p>Population: {city.population.toLocaleString()}</p>
  </Modal>
{/if}

<style>
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