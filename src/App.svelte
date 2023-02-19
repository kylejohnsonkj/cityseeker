<script>
	import Nav from "./components/Nav.svelte";
	import Lights from "./components/Lights.svelte";
	import MapView from "./components/MapView.svelte";
  import Actions from "./components/Actions.svelte";
	import ModalView from "./components/ModalView.svelte";

	import { onMount } from 'svelte';

	let lights, map, modal;
	let width, height;

	onMount(async () => {
		modal.toggleHelp();
	});
</script>

<svelte:window bind:innerWidth={width} bind:innerHeight={height}/>

<main>
	<Nav {modal} />
	<Lights bind:this={lights} />
	<MapView bind:this={map} {width} {height} {lights} {modal} />
	<Actions {map} />
	<ModalView bind:this={modal} />
</main>
