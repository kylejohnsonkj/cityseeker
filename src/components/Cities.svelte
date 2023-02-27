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
    const validStates = [
      'AL', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA',
      'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND',
      'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
    ];
    const filteredData = data.filter(row => {
      return validStates.includes(row.state_id);
    });

    return filteredData.map(row => ({
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