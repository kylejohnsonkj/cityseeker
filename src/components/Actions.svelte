<script>
  import Button from "./Button.svelte";
  export let map;
  export let lights;
  import { onMount } from 'svelte';

  let score = lights.getScore();

  export function updateScore(newScore) {
    score = newScore;
  }

  // force score to apply correct coloring on load
  onMount(async () => {
    updateScore(score);
  });
</script>

<div class="actions">
  <Button type="restart" on:click={map.reset(750, false)}/>
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
</style>