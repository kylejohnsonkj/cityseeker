<script>
  import Button from "./Button.svelte";
  export let map;
  export let compass;
  export let lights;

  let currentRound = lights._getCurrentRound();

  export function updateCurrentRound(round) {
    currentRound = round;
  }

  export function getCompass() {
    return compass;
  }
</script>

<div class="actions">
  <Button type="compass" on:click={map.reset(750, false)} bind:this={compass} {map}/>
  <div class="info">
    <div class="round">Round {currentRound + 1} of {lights.maxRounds}</div>
    <div class="score">30pts</div>
  </div>
  <div class="spacer" />
  <Button type="minus" on:click={map.zoomOut} />
  <Button type="plus" on:click={map.zoomIn} />
</div>

<style>
  .actions {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 15px;
  }
  .spacer {
    flex: 1;
  }
  .actions > * {
    padding: 10px;
  }
  .info {
    margin-left: 10px;
  }
  .round {
    color: var(--text);
  }
  .score {
    font-weight: bold;
    color: green;
  }
</style>