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

  async function getCitiesForToday() {
    try {
      const rows = await parseData();

      // filter cities to within the contiguous US
      let filteredRows = rows.filter(row => {
        return validStates.includes(row.state_id);
      });

      // use today's date as the seed
      let date = new Date().toISOString()
      date = date.substring(0, date.indexOf('T'));
      const rng = seedrandom(date);

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