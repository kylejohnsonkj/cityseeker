<script>
  import Papa from 'papaparse';
  import { writable } from 'svelte/store';

  const csvFile = writable([]);

  async function readCsvFile() {
    const response = await fetch('./docs/uscities.csv');
    const reader = response.body.getReader();
    const result = await reader.read();
    const decoder = new TextDecoder('utf-8');
    const csv = decoder.decode(result.value);
    const { data } = Papa.parse(csv, { header: true });
    return data.map(row => ({
      city: String(row.city),
      state: String(row.state_id),
      population: parseFloat(row.population),
      lat: parseFloat(row.lat),
      lng: parseFloat(row.lng),
    }));
  }

  (async function() {
    const data = await readCsvFile();
    csvFile.set(data);
  })();

  export function getRandomCity() {
    const index = Math.floor(Math.random() * $csvFile.length);
    const city = $csvFile[index];
    console.log('Random city:', city);
    return city;
  }

</script>