<script>
  import Papa from 'papaparse';
  import seedrandom from 'seedrandom';
  import { onMount } from 'svelte';
  import { mergeSort } from '../sort'

  export let lights;
  let cities;

  export function getCurrentCity() {
    let round = lights._getCurrentRound();
    return round == lights.maxRounds ? cities[round - 1] : cities[round];
  }

  export function getRegion() {
    const city = getCurrentCity();
    const stateRegions = {
      AL: 'South', AK: 'West', AZ: 'West', AR: 'South', CA: 'West',
      CO: 'West', CT: 'Northeast', DE: 'South', FL: 'South', GA: 'South',
      HI: 'West', ID: 'West', IL: 'Midwest', IN: 'Midwest', IA: 'Midwest',
      KS: 'Midwest', KY: 'South', LA: 'South', ME: 'Northeast', MD: 'South',
      MA: 'Northeast', MI: 'Midwest', MN: 'Midwest', MS: 'South', MO: 'Midwest',
      MT: 'West', NE: 'Midwest', NV: 'West', NH: 'Northeast', NJ: 'Northeast',
      NM: 'West', NY: 'Northeast', NC: 'South', ND: 'Midwest', OH: 'Midwest',
      OK: 'South', OR: 'West', PA: 'Northeast', RI: 'Northeast', SC: 'South',
      SD: 'Midwest', TN: 'South', TX: 'South', UT: 'West', VT: 'Northeast',
      VA: 'South', WA: 'West', WV: 'South', WI: 'Midwest', WY: 'West',
    };
    return stateRegions[city.state_id] || null;
  }


  const validStates = [
    'AL', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA',
    'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND',
    'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
  ];

  async function parseData() {
    const response = await fetch('./docs/uscities.csv');
    const csvData = await response.text();
    return new Promise((resolve, reject) => {
        Papa.parse(csvData, { 
          header: true, 
          dynamicTyping: true,
          complete: (results) => resolve(results.data),
          error: (error) => reject(error)
        });
      });
  }

  function getCurrentDate() {
    let date = new Date().toISOString()
    return date.substring(0, date.indexOf('T'));
  }

  async function getCitiesForToday() {
    try {
      const rows = await parseData();

      // filter cities to within the contiguous US
      let filteredRows = rows.filter(row => {
        return validStates.includes(row.state_id);
      });

      // use today's date as the seed
      const rng = seedrandom(getCurrentDate());

      // sort by seed
      filteredRows = mergeSort(filteredRows, () => rng() - 0.5);

      // limit cities to match number of rounds
      return filteredRows.slice(0, lights.maxRounds);
      
    } catch (error) {
      console.error(error);
    }
  }

  onMount(async () => {
		cities = await getCitiesForToday();
    console.table(cities);
	});
</script>