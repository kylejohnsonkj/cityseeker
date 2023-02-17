<script>
  export let type;
  const size = type == "restart" ? 30 : 25;
  const left = type == "plus" ? 20 : 0;
</script>

<button style="margin-left: {left}px" on:click>
  <img src="images/{type}.svg" alt="{type}" width="{size}" height="{size}">
</button>

<style>
  button {
    width: 50px;
    height: 50px;
    background: var(--button);
		border: none;
		cursor: pointer;
    border-radius: 15%;
  }
  @media (hover: hover) {
    button:hover {
      background-color: var(--button-hover);
    }
    button:hover img {
      filter: brightness(5);
    }
  }
  button:active {
    background-color: var(--button-active);
  }
  button:active img {
    filter: brightness(3);
  }
</style>