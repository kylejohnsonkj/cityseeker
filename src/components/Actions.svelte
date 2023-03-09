<script>
  import Button from "./Button.svelte";
  export let map;
  export let lights;

  let currentRound = lights._getCurrentRound();
  let score = lights.getScore();
  let region = "";
  let zeroPtsClass;

  export function updateCurrentRound(newRound) {
    currentRound = newRound;
  }
  
  export function updateScore(newScore) {
    score = newScore;
    // TODO: green < 40, orange < 50, red = 50
    zeroPtsClass = score == 0 ? "zeroPts" : "";
  }

  export function updateRegion(newRegion) {
    region = newRegion;
  }
</script>

<div class="actions">
  <Button type="restart" on:click={map.reset(750, false)}/>
  <div class="info">
    <div class="region">Region: {region}</div>
    <div class="round">Round {currentRound + 1} / {lights.maxRounds}</div>
    <div class="score {zeroPtsClass}">{score}pts</div>
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
  .actions > *:not(.info) {
    padding: 10px;
  }
  .info {
    margin-left: 20px;
  }
  .round {
    color: var(--text);
  }
  .score {
    font-weight: bold;
    color: green;
  }
  .score.zeroPts {
    color: black;
  }
</style>