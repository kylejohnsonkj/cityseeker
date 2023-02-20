<script>
  import { Map } from '@beyonk/svelte-mapbox';
  import * as turf from '@turf/turf';

  export let height;
  export let lights;
  export let modal;

  let mapComponent;
  function getMap() {
    return mapComponent.getMap();
  }
  
  const defaultCenter = [-97.90, 39.38];
  let defaultZoom;

  let city;
  let targetLocation;

  const maxBounds = [
    [-138.8, 22], // Southwest coordinates
    [-57, 51] // Northeast coordinates
  ];

  (async function() {
    city = await getRandomCity();
    targetLocation = [Number(city.longitude), Number(city.latitude)];
    console.log(targetLocation);
  })();
  
  function ready() {
    getMap().setMaxBounds(maxBounds);

    mapComponent.setZoom(0);
    mapComponent.setCenter(defaultCenter);
    
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

    const options = { units: "miles" }
    console.log("Target: " + targetLocation)
    console.log("Guess: " + guessLocation)
    var milesAway = turf.distance(targetLocation, guessLocation, options);
    console.log(milesAway);

    let guessAccuracy = getGuess(milesAway);
    let guess = lights.guessMap[guessAccuracy];

    var el = document.createElement('div');
    el.className = 'marker';
    el.style.fontSize = '30px';
    el.style.width = '31.5px';
    el.innerHTML = guess.emoji;

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
      getMap().setMaxBounds(null);
      reset(2000, true);
      let didWin = guessAccuracy == 5;
      modal.gameOver(city, didWin);
    }
  }

  const API_KEY = '<RAPID_API_KEY>'; // Replace with your actual API key
  const URL = 'https://wft-geo-db.p.rapidapi.com/v1/geo/cities'; // API endpoint

  async function getRandomCity() {
    // Parameters for the API request
    const params = {
      countryIds: 'US', // Filter to only include cities in the US
      types: 'CITY',
      sort: '-population', // Sort by population in descending order
      limit: 1, // Limit to 1 result
      offset: Math.floor(Math.random() * 500), // Random offset to retrieve a random city
      regionIds: '-HI,-AK,-AS,-GU,-MP,-PR,-VI' // only 48 states
    };

    try {
      const response = await fetch(URL + '?' + new URLSearchParams(params), {
        headers: {
          'X-RapidAPI-Key': API_KEY
        }
      });

      const data = await response.json();
      const city = data.data[0]; // Get the first (and only) result
      console.log(city);
      console.log(`Random city in the continental US: ${city.city}, ${city.regionCode} at (${city.latitude}, ${city.longitude}). Population ${city.population}`);
      return city;
    } catch (error) {
      console.log(error);
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
        center: [Number(city.longitude), Number(city.latitude)],
        zoom: defaultZoom,
        duration: duration
      });
    } else {
      mapComponent.flyTo({
        zoom: defaultZoom,
        duration: duration
      });
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

