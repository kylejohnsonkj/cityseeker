<script>
	import Nav from "./components/Nav.svelte";
	import Lights from "./components/Lights.svelte";
	import Map from "./components/Map.svelte";
  import Actions from "./components/Actions.svelte";

	let height;
</script>

<svelte:window bind:innerHeight={height}/>

<main>
	<Nav />
	<Lights />
	<Map {height}/>
	<Actions />
</main>
