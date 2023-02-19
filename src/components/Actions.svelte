<script>
  import Button from "./Button.svelte";
  export let map;
</script>


<div class="actions">
  <Button type="restart" on:click={map.reset(750)}/>
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