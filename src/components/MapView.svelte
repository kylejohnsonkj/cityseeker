<script>
  import Cities from './Cities.svelte';
  import { Map } from '@beyonk/svelte-mapbox';
  import * as turf from '@turf/turf';

  export let height;
  export let lights;
  export let modal;
  
  let cities;
  let mapComponent;

  function getMap() {
    return mapComponent.getMap();
  }
  
  let defaultCenter = [-98, 37.25];

  let city;
  let defaultZoom;
  let targetLocation;

  // little trick to center the map on any screen size while keeping it fit to the USA height
  const maxBounds = [
    [defaultCenter[0], defaultCenter[1] - 13.25], // Southwest coordinates
    [defaultCenter[0], defaultCenter[1] + 13.25] // Northeast coordinates
  ];

  function ready() {
    city = cities.getRandomCity();
    targetLocation = [city.lng, city.lat];

    getMap().fitBounds(maxBounds, { animate: false });
    defaultZoom = getMap().getZoom();
  }

  function getGuess(milesAway) {
    let guessMap = lights.guessMap;
    if (milesAway < guessMap[5].radius) {
      return 5;
    } else if (milesAway < guessMap[4].radius) {
      return 4;
    } else if (milesAway < guessMap[3].radius) {
      return 3;
    } else if (milesAway < guessMap[2].radius) {
      return 2;
    } else {
      return 1;
    }
  }

  function addMarker(e) {
    if (lights.getCurrentGuess() >= lights.maxGuesses) {
      // game is over
      return;
    }

    const data = e.detail;
    if (data.lng === undefined || data.lat === undefined) {
      return;
    }

    let guessLocation = [data.lng, data.lat];
    console.log(guessLocation);

    console.log("Target: " + targetLocation)
    console.log("Guess: " + guessLocation)
    var milesAway = turf.distance(targetLocation, guessLocation, { units: "miles" });
    console.log(milesAway);

    let guessAccuracy = getGuess(milesAway);
    let guess = lights.guessMap[guessAccuracy];

    var el = document.createElement('div');
    el.className = 'marker';
    el.style.fontSize = '30px';
    el.style.width = '31.5px';

    let arrow = getArrow(guessLocation, milesAway, guessAccuracy);

    const guessDiv = "<div style='position: relative; display: inline-block;'><span>" + guess.emoji + "</span><span style='position: absolute; top: 35%; left: 50%; transform: translate(-50%, -50%); color: white; font-size: 0.9em;'>" + arrow + "</span></div>";
    el.innerHTML = guessDiv;

    let marker = new mapboxgl.Marker(el);
    marker.setLngLat(guessLocation);
    marker.addTo(getMap());

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

    console.log("currentGuess: " + lights.getCurrentGuess());

    console.log(lights.maxGuesses);

    if (lights.getCurrentGuess() == lights.maxGuesses || guessAccuracy == 5) {
      addCircle(2);
      addCircle(3);
      addCircle(4);
      addCircle(5);
      reset(2000, true);
      let didWin = guessAccuracy == 5;
      modal.gameOver(city, didWin);
    }
  }

  function getArrow(guessLocation, dist, guess) {
    const leftArrow = "⇦"
    const rightArrow = "⇨"
    const upArrow = "⇧"
    const downArrow = "⇩"
    const noArrow = ""

    if (!lights.hasGuessedBefore(guess)) {
      return noArrow;
    }

    // var verticalMiles = turf.distance(guessLocation, [targetLocation[0], guessLocation[1]], { units: "miles" });
    // var horizontalMiles = turf.distance(guessLocation, [guessLocation[0], targetLocation[1]], { units: "miles" });
    // var bearing = turf.bearing(guessLocation, targetLocation);

    const bear = turf.bearing(guessLocation, targetLocation);

    // Calculate the offset in meters by using trigonometry to find the horizontal and vertical components
    const offsetHoriz = dist * Math.sin(bear * Math.PI / 180);
    const offsetVert = dist * Math.cos(bear * Math.PI / 180);

    console.log("horiz: " + offsetHoriz);
    console.log("vert: " + offsetVert);

     if (Math.abs(offsetHoriz) > Math.abs(offsetVert)) {
      // left or right (+)
      if (offsetHoriz >= 0) { return rightArrow; }
      if (offsetHoriz < 0) { return leftArrow; }
     } else if (Math.abs(offsetVert) > Math.abs(offsetHoriz)) {
      // up or down (+)
      if (offsetVert >= 0) { return upArrow; }
      if (offsetVert < 0) { return downArrow; }
     }
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

    getMap().addLayer({
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
    });
  }

  export function reset(duration, isGameOver) {
    if (isGameOver) {
      mapComponent.flyTo({
        center: targetLocation,
        zoom: defaultZoom,
        duration: duration
      });
    } else {
      getMap().fitBounds(maxBounds);
    }
  }

  export function zoomOut() {
    mapComponent.flyTo({
      center: getMap().getCenter(),
      zoom: getMap().getZoom() - 1
    });
  }

  export function zoomIn() {
    console.log('zoom in');
    mapComponent.flyTo({
      center: getMap().getCenter(),
      zoom: getMap().getZoom() + 1
    });
  }

  let extraHeight = window.matchMedia && window.matchMedia('(max-width: 500px)').matches ? 19 : 0

</script>

<div class="map" style="height: {height + extraHeight - 205}px">
  <Cities bind:this={cities} />
  <Map 
  accessToken="pk.eyJ1Ijoia3lqb2huc29uMDkiLCJhIjoiY2xmb2gyNDhhMHZiMzN6cGZyd2hjendkeSJ9.0_uG5PL4M8XWUD-4tDPIBQ" 
  bind:this={mapComponent} 
  on:click={addMarker}
  on:ready={ready}>
  </Map>
  <!-- style='mapbox://styles/mapbox/light-v10'  -->
</div>

<style>
  .map {
    border-bottom: 1px solid lightgray;
    background-color: gray;
  }
</style>

