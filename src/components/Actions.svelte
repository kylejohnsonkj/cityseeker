<script>
  import Button from "./Button.svelte";
  export let map;
  export let lights;
  import { onMount } from 'svelte';

  let score = lights.getScore();
  let showCredits = true;

  export function updateScore(newScore) {
    score = newScore;
  }

  export function hideCredits() {
    setTimeout(() => {
      showCredits = false;
    }, 400);
  }

  // force score to apply correct coloring on load
  onMount(async () => {
    updateScore(score);
  });

  let extraHeight = window.matchMedia && window.matchMedia('(max-width: 400px)').matches ? 6 : -2
</script>

<div class="actions">
  <Button type="restart" on:click={map.reset(750, false)}/>
  <div class="spacer" />
  <Button type="minus" on:click={map.zoomOut} />
  <Button type="plus" on:click={map.zoomIn} />
</div>
{#if showCredits}
  <div class="credits" style="margin-top: {extraHeight}px;">
    Created by Kyle Johnson
  </div>
{/if}

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
  .credits {
    text-align: center;
  }
</style>