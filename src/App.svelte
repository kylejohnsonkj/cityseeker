<script>
	import Nav from "./components/Nav.svelte";
	import Lights from "./components/Lights.svelte";
	import MapView from "./components/MapView.svelte";
  import Actions from "./components/Actions.svelte";
	import ModalView from "./components/ModalView.svelte";

	import { onMount } from 'svelte';

	let lights, map, actions, modal;
	let height;

	onMount(async () => {
		modal.toggleHelp();
	});
</script>

<svelte:window bind:innerHeight={height}/>

<main>
	<Nav {modal} />
	<Lights bind:this={lights} />
	<MapView bind:this={map} {height} {lights} {modal} {actions} />
	<Actions bind:this={actions} {map} />
	<ModalView bind:this={modal} {lights} />
</main>
