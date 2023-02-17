<script>
	import Nav from "./components/Nav.svelte";
	import Lights from "./components/Lights.svelte";
	import Map from "./components/Map.svelte";
  import Actions from "./components/Actions.svelte";

	let height;
	export let ready;
</script>

<svelte:head>
	<script defer async
	src="https://maps.googleapis.com/maps/api/js?key=<GMAPS_API_KEY>&callback=initMap">
	</script>
</svelte:head>

<svelte:window bind:innerHeight={height}/>

<main>
	<Nav />
	<Lights />
	{ #if ready }
		<Map {height}/>
	{ /if }
	<Actions />
</main>

<style>
	:global(body) {
		padding: 0;
	}
	</style>