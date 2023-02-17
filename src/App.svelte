<script>
	import Nav from "./components/Nav.svelte";
	import Lights from "./components/Lights.svelte";
	import MapContainer from "./components/MapContainer.svelte";
  import Actions from "./components/Actions.svelte";

	let height;
	let map;
</script>

<svelte:window bind:innerHeight={height}/>

<main>
	<Nav />
	<Lights />
	<MapContainer {height} bind:this={map} />
	<Actions {map} />
</main>
