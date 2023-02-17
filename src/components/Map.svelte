<script>
  import { onMount } from 'svelte';

  let container;
  let map;
  let zoom = 4;
  let center = {lat: 39.8, lng: -98.6};

  export let height;
   
  onMount(async () => {
    map = new google.maps.Map(container, {
      zoom,
      center,
      disableDefaultUI: true
    });
  });
</script>

<div class="map" style="height: {height - 205}px" bind:this={container}></div>

<style>
  .map {
    border-bottom: 1px solid lightgray;
    background-color: gray;
  }
</style>