<script>
  import { Map, Geocoder, Marker, controls } from '@beyonk/svelte-mapbox'

  export let height;

  let markers = []
  
  let mapComponent;
  let center;
  export let zoom;

  const defaultCenter = [-98.56, 39.35];
  const defaultZoom = 3.5;

  function ready() {
    mapComponent.setCenter(defaultCenter);
    zoom = defaultZoom;
    // mapComponent.flyTo({center:[39.8,-45.6]});
    // console.log(mapComponent.markers)
  }

  function addMarker(e) {
    const data = e.detail;
    if (data.lng === undefined || data.lat === undefined) {
      return;
    }
    console.log(data.lat + " " + data.lng)

    let marker = new mapboxgl.Marker()
    .setLngLat([data.lng, data.lat])
    .addTo(mapComponent.getMap());
    markers.push(marker);

    console.log(markers)
  }

  export const restart = (e) => ready();

  export const zoomOut = (e) => zoom -= 1;
  export const zoomIn = (e) => zoom += 1;


</script>

<div class="map" style="height: {height - 205}px">
  <Map 
  accessToken="pk.eyJ1Ijoia3lqb2huc29uMDkiLCJhIjoiY2xmb2gyNDhhMHZiMzN6cGZyd2hjendkeSJ9.0_uG5PL4M8XWUD-4tDPIBQ" 
  bind:this={mapComponent} 
  bind:center 
  bind:zoom
  on:click={addMarker}
  on:ready={ready}>
  </Map>
</div>

<style>
  .map {
    border-bottom: 1px solid lightgray;
    background-color: gray;
  }
</style>

