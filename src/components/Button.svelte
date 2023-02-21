<script>
  export let type = null;
  export let text = null;
  export let small = false;

  const size = getSize();
  const left = type == "plus" ? 20 : 0;

  let buttonSize = type == "close" ? 30 : 50;
  let buttonClass = small ? "small" : "";
  let textClass = text != null ? "text" : "";

  function getSize() {
    switch(type) {
      case "close": return 20;
      case "restart": return 30;
      default: return 25;
    }
  }
</script>

<button class="{buttonClass} {textClass}" style="--size:{buttonSize}px; margin-left:{left}px" on:click>
  {#if text != null}
     {text}
  {:else}
    <img src="images/{type}.svg" alt="{type}" width="{size}" height="{size}">
  {/if}
</button>

<style>
  button {
    width: var(--size);
    height: var(--size);
    background: var(--button);
		border: none;
		cursor: pointer;
    border-radius: 15%;
  }
  button.text {
    width: fit-content;
    height: fit-content;
    padding: 10px 10px;
    font-weight: 600;
    font-size: 1em;
    align-self: flex-end;
    border-radius: 8px;
    color: royalblue;
  }
  button.small {
    margin-bottom: 8px;
    background-color: white;
  }
  button img {
    margin-top: 2px;
  }
  @media (hover: hover) {
    button:hover {
      color: white;
      background-color: var(--button-hover);
    }
    button:hover img {
      filter: brightness(5);
    }
  }
  button:active {
    color: white;
    background-color: var(--button-active);
  }
  button:active img {
    filter: brightness(3);
  }
</style>