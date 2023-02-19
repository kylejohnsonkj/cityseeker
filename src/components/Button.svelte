<script>
  export let type;
  export let small;

  const size = getSize();
  const left = type == "plus" ? 20 : 0;

  let buttonSize = (type == "close") ? 30 : 50;
  let buttonClass = small ? "small" : "";

  function getSize() {
    switch(type) {
      case "close": return 20;
      case "restart": return 30;
      default: return 25;
    }
  }
</script>

<button class="{buttonClass}" style="--size:{buttonSize}px; margin-left:{left}px" on:click>
  <img src="images/{type}.svg" alt="{type}" width="{size}" height="{size}">
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
  button.small {
    margin-bottom: 8px;
    background-color: white;
  }
  button img {
    margin-top: 2px;
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