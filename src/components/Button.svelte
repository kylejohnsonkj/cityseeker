<script>
  export let type = null;
  export let text = null;
  export let small = false;

  let angle = 0;
  let disabledClass = "disabled";

  export function setAngle(newAngle) {
    disabledClass = newAngle == 0 ? "disabled" : "";
    angle = closestEquivalentAngle(angle, newAngle);
  }

  function closestEquivalentAngle(from, to) {
    var delta = ((((to - from) % 360) + 540) % 360) - 180;
    return from + delta;
}

  const size = getSize();
  const left = type == "plus" ? 20 : 0;

  let textClass = text != null ? "text" : "";

  let buttonSize = type == "close" ? 30 : 50;
  let buttonClass = small ? "small" : "";

  let compassSize = 55;
  let compassClass = type == "compass" ? "compass" : "";

  function getSize() {
    switch(type) {
      case "close": return 20;
      case "restart": return 30;
      case "compass": return 50;
      default: return 25;
    }
  }
</script>

<button class="{buttonClass} {textClass} {compassClass} {disabledClass}" style="--size:{buttonSize}px; --compassSize:{compassSize}px; margin-left:{left}px" on:click>
  {#if text != null}
     {text}
  {:else}
    <img src="images/{type}.svg" alt="{type}" width="{size}" height="{size}" style="transform: rotate({angle}deg);">
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
  button.compass {
    width: var(--compassSize);
    height: var(--compassSize);
    background: none;
    transition: opacity 0.7s cubic-bezier(0.175, 0.885, 0.5, 1.8);
  }
  button.compass.disabled {
    opacity: 0;
  }
  button img {
    margin-top: 2px;
  }
  button.compass img {
    width: var(--compassSize);
    height: var(--compassSize);
    margin-top: 0px;
    transition: transform 0.7s cubic-bezier(0.175, 0.885, 0.5, 1.8);
    transition-delay: 0.25s;
  }
  @media (hover: hover) {
    button:not(.compass):hover {
      color: white;
      background-color: var(--button-hover);
    }
    button:not(.compass):hover img {
      filter: brightness(5);
    }
  }
  button:not(.compass):active {
    color: white;
    background-color: var(--button-active);
  }
  button:not(.compass):active img {
    filter: brightness(3);
  }
</style>