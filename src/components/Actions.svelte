<script>
  import Button from "./Button.svelte";
  export let map;
  export let compass;

  export function getCompass() {
    return compass;
  }
</script>


<div class="actions">
  <Button type="compass" on:click={map.reset(750, false)} bind:this={compass} {map}/>
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