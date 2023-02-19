<script>
  import { Map } from '@beyonk/svelte-mapbox';
  import * as turf from '@turf/turf';

  export let width;
  export let height;
  export let lights;
  export let modal;

  let mapComponent;
  function getMap() {
    return mapComponent.getMap();
  }
  
  export let zoom;
  let center;

  const defaultCenter = [-98.56, 39.35];
  let defaultZoom;

  let city;
  let targetLocation;

  (async function() {
    city = await getRandomCity();
    targetLocation = [Number(city.longitude), Number(city.latitude)];
    console.log(targetLocation);
  })();
  
  function ready() {
    defaultZoom = Math.min(width, height) / 200;
    mapComponent.setCenter(defaultCenter);
    mapComponent.setZoom(defaultZoom);
  }

  let marker;
  let markers = [];

  let emojiMap = {0: "⚪️", 1: "🔴", 2: "🟠", 3: "🟡", 4: "🟢"}

  function addMarker(e) {
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

    let guessAccuracy;
    if (milesAway < 75) {
      guessAccuracy = 4;
    } else if (milesAway < 500) {
      guessAccuracy = 3;
    } else if (milesAway < 1000) {
      guessAccuracy = 2;
    } else {
      guessAccuracy = 1;
    }

    var el = document.createElement('div');
    el.className = 'marker';
    el.style.fontSize = '30px';
    el.style.width = '31.5px';
    el.innerHTML = emojiMap[guessAccuracy];

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

    let round = lights.makeGuess(guessAccuracy);

    console.log("round: " + round)

    if (round == 6 || guessAccuracy == 4) {
      addCircle(2);
      addCircle(3);
      addCircle(4);
      reset(2000);
      let didWin = guessAccuracy == 4;
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
      regionIds: '-HI,-AK' // Exclude Hawaii and Alaska
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
    const guessRadius = { 2: 1000, 3: 500, 4: 75 }
    const guessColor = { 2: "#E17F01", 3: "#FED703", 4: "#06AE01"}

    var circle = {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": targetLocation,
      },
      "properties": {
        "radius": guessRadius[layer]
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
        "fill-color": guessColor[layer],
        "fill-opacity": 0.5
      }
    });
  }

  export function reset(duration) {
    mapComponent.flyTo({
      center: defaultCenter,
      zoom: defaultZoom,
      duration: duration
    });
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

