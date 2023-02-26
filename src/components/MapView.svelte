<script>
  import Cities from './Cities.svelte';
  import { Map } from '@beyonk/svelte-mapbox';
  import * as turf from '@turf/turf';

  export let height;
  export let lights;
  export let modal;
  export let actions;
  
  let cities;
  let mapComponent;
  let markers = [];
  let layers = [];

  function getMap() {
    return mapComponent.getMap();
  }
  
  let defaultCenter = [-98, 37.25];

  // little trick to contain region on any screen size
  const bounds = [
    [defaultCenter[0], defaultCenter[1] - 13.25], // Southwest coordinates
    [defaultCenter[0], defaultCenter[1] + 13.25] // Northeast coordinates
  ];

  let city;
  let targetLocation;
  let defaultZoom;

  function ready() {
    city = cities.getRandomCity();
    targetLocation = [city.lng, city.lat];
    getMap().fitBounds(bounds, { animate: false });
    defaultZoom = getMap().getZoom();
  }

  function click(event) {
    const data = event.detail;
    if (data.lng === undefined || data.lat === undefined) {
      return;
    }

    if (lights.isGameOver()) {
      modal.gameOver(city, lights.getLatestGuessAccuracy() == lights.winAccuracy);
      return; // game is over
    }

    const guessLocation = [data.lng.toFixed(4), data.lat.toFixed(4)];
    console.log("guessed: " + guessLocation);

    const milesAway = Math.floor(turf.distance(targetLocation, guessLocation, { units: "miles" }));
    console.log("miles away: " + milesAway);

    const guessAccuracy = lights.getGuessAccuracy(milesAway);
    const guess = lights.guessMap[guessAccuracy];

    addMarker(guessLocation, milesAway, guess);

    // if (marker === undefined) {
    //   var el = document.createElement('div');
    //   el.className = 'marker';
    //   el.style.fontSize = '30px';

    //   marker = new mapboxgl.Marker(el);
    //   marker.setLngLat(guessLocation);
    //   marker.addTo(getMap());
    // } else {
    //   marker.setLngLat(guessLocation)
    // }
    // marker.getElement().innerHTML = emojiMap[guessAccuracy];

    lights.makeGuess(guessAccuracy);
    console.log("accuracy: " + guessAccuracy);

    // check for game over
    if (lights.isGameOver()) {
      addCircle(2); // red
      addCircle(3); // orange
      addCircle(4); // yellow
      addCircle(5); // green

      lights.saveGuesses();
      modal.gameOver(city, guessAccuracy == lights.winAccuracy);
      reset(2000, true);
    } else {
      setCompassAngle(guessLocation, milesAway, guess);
    }
  }

  function addMarker(guessLocation, milesAway, guess) {
    var el = document.createElement('div');
    el.className = 'marker';
    el.style.fontSize = '30px';
    el.style.width = '31.5px';
    el.innerHTML = guess.emoji;

    let marker = new mapboxgl.Marker(el);
    marker.setLngLat(guessLocation);
    marker.addTo(getMap());

    markers.push(marker);
  }

  function setCompassAngle(guessLocation, dist, guess) {
    let angle = 0;

    if (lights.isBestGuessSoFar(guess.accuracy)) {
      actions.getCompass().setAngle(angle);   // disable compass
      return
    }

    const bearing = turf.bearing(guessLocation, targetLocation);
    const horizDist = dist * Math.sin(bearing * Math.PI / 180);
    const vertDist = dist * Math.cos(bearing * Math.PI / 180);

    if (Math.abs(horizDist) >= Math.abs(vertDist)) {
      angle = horizDist >= 0 ? 45 /*right*/ : -135 /*left*/;
    } else {
      angle = vertDist >= 0 ? -45 /*up*/ : 135 /*down*/;
    }
    actions.getCompass().setAngle(angle);
  }

  function addCircle(layer) {
    let guess = lights.guessMap[layer];

    var circle = {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": targetLocation,
      },
      "properties": {
        "radius": guess.radius
      }
    };

    let options = {steps: 64, units: 'miles'};
    let circleFeature = turf.circle(targetLocation, circle.properties.radius, options);

    let circleLayer = {
      "id": "circle-layer" + layer,
      "type": "fill",
      "source": {
        "type": "geojson",
        "data": circleFeature
      },
      "paint": {
        "fill-color": guess.color,
        "fill-opacity": 0.5
      }
    };

    getMap().addLayer(circleLayer);
    layers.push(circleLayer);
  }

  export function reset(duration, isGameOver) {
    if (isGameOver) {
      mapComponent.flyTo({
        center: targetLocation,
        zoom: defaultZoom,
        duration: duration
      });
    } else {
      // button is pressed
      getMap().fitBounds(bounds);
    }
  }

  export function zoomIn() {
    console.log('zoom in');
    mapComponent.flyTo({
      center: getMap().getCenter(),
      zoom: getMap().getZoom() + 1
    });
  }

  export function zoomOut() {
    mapComponent.flyTo({
      center: getMap().getCenter(),
      zoom: getMap().getZoom() - 1
    });
  }

  export function nextRound() {
    // remove markers
    for (let i = 0; i < markers.length; i++) {
      markers[i].remove();
    }
    markers = [];

    // clear circles
    for (let i = 0; i < layers.length; i++) {
      getMap().removeLayer(layers[i].id);
      getMap().removeSource(layers[i].id);
    }
    layers = [];

    // reset guesses
    lights.resetForNextRound();

    // pick new city
    city = cities.getRandomCity();
    targetLocation = [city.lng, city.lat];

    // reset map position
    reset(null, false);
  }

  let extraHeight = window.matchMedia && window.matchMedia('(max-width: 500px)').matches ? 19 : 0
</script>

<div class="map" style="height: {height + extraHeight - 208}px">
  <Cities bind:this={cities} />
  <Map 
  accessToken="pk.eyJ1Ijoia3lqb2huc29uMDkiLCJhIjoiY2xmb2gyNDhhMHZiMzN6cGZyd2hjendkeSJ9.0_uG5PL4M8XWUD-4tDPIBQ" 
  bind:this={mapComponent} 
  on:click={click}
  on:ready={ready}
  options={{ touchZoomRotate: false, doubleClickZoom: false }}>
  </Map>
  <!-- style='mapbox://styles/mapbox/light-v10'  -->
</div>

<style>
  .map {
    border-bottom: 1px solid lightgray;
    background-color: gray;
  }
</style>

