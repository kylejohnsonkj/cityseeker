<script>
  import Papa from 'papaparse';
  import seedrandom from 'seedrandom';
  import { writable } from 'svelte/store';

  const csvFile = writable([]);

  export let lights;
  let cities;

  export function getCurrentCity() {
    const round = lights.getCurrentRound();
    return cities[round];
  }

  async function readCsvFile() {
    const response = await fetch('./docs/uscities.csv');
    const reader = response.body.getReader();
    const result = await reader.read();
    const decoder = new TextDecoder('utf-8');
    const csv = decoder.decode(result.value);
    const { data } = Papa.parse(csv, { header: true });

    const validStates = [
      'AL', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA',
      'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND',
      'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
    ];
    
    const filteredData = data.filter(row => {
      return validStates.includes(row.state_id);
    });

    // use current date as seed
    let iso = new Date().toISOString()
    iso = iso.substring(0, iso.indexOf('T'));

    const rng = seedrandom(iso);
    const random = () => rng();
    filteredData.sort(() => random() - 0.5);

    return filteredData.map(row => ({
      city: String(row.city),
      state: String(row.state_id),
      lat: parseFloat(row.lat),
      lng: parseFloat(row.lng),
      population: parseFloat(row.population),
    }));
  }

  (async function() {
    const data = await readCsvFile();
    csvFile.set(data);
    cities = $csvFile.slice(0, 5);
    console.table(cities);
  })();

</script>