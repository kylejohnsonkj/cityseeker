<script>
	import Modal from "./Modal.svelte";
  import Button from "./Button.svelte";

  let showHelp;
  let showGameOver;
  let city;
  let didWin;

  export let map;
  export let lights;
  export let actions;

	export function toggleHelp() {
		showHelp = !showHelp;
	}

  export function nextRound() {
    showGameOver = false;
    map.nextRound();
  }
  
  export function gameOver(targetCity, targetDidWin) {
    showGameOver = true;
    city = targetCity;
    didWin = targetDidWin;
    actions.updateScore(lights.getScore());
  }

  // package.json --http2 --key key.pem --cert cert.pem
  function shareResult() {
    const shareData = {
      title: 'Searchle',
      text: `I scored ${lights.getScore()}`,
    };
    navigator.share(shareData)
      .then(() => console.log('Shared successfully'))
      .catch((error) => console.log(`Error sharing: ${error}`));
  }

  function copyResult() {
    let result = `Searchle ${lights.getScore()}/${lights.getMaxScore()}\n\n`;
    result += lights.getGuessesGridAsEmoji();
    alert(result);
  }
</script>

{#if showHelp}
  <Modal on:close="{() => showHelp = false}">
    <h2 slot="header">How To Play</h2>
    <br>
    <b>Guess the location in {lights.maxGuesses} tries</b>
    <ul class="instructions">
      <li>The location is a city in the 48 states</li>
      <li>Your marker color reflects how far away you are</li>
      <li>
        Use the compass
        <img src="../images/compass.svg" alt="compass preview" width=30 height=30 />
        to your advantage
      </li>
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
    <h2 slot="header">{didWin ? "City Found!" : lights.hasNextRound() ? "Limit Reached" : "Game Over"}</h2>
    <br>
    <p>The city was {city.city}, {city.state_id}</p>
    <p>Population: {city.population.toLocaleString()}</p>
    <br>
    <div class="bottom">
      <div>
        <span>Round score: {lights.getRoundScore()}/{lights.getMaxRoundScore()}</span>
        <div><b>{lights.hasNextRound() ? "Total" : "Final"} score: {lights.getScore()}/{lights.getMaxScore()}</b></div>
      </div>
      {#if lights.hasNextRound()}
        <Button text="Next Round" on:click={nextRound} />
      {:else}
        {#if navigator.share}
          <Button text="Share Result" on:click={shareResult} />
        {:else}
          <Button text="Share Result" on:click={copyResult} />
        {/if}
      {/if}
    </div>
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
  ul.instructions li:not(:last-child) {
    margin-top: 3.5px;
  }
  ul.no-style {
    padding-left: 15px;
    list-style: none;
  }
  h2, h3 {
    padding-bottom: 5px;
  }
  img {
    vertical-align: middle;
  }
</style>