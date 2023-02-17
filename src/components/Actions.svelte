<script>
  import Button from "./Button.svelte";
</script>


<div class="actions">
  <Button type="restart" />
  <div class="spacer" />
  <Button type="minus" />
  <Button type="plus" />
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