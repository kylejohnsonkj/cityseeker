<script>
	import Nav from "./components/Nav.svelte";
	import Lights from "./components/Lights.svelte";
	import MapView from "./components/MapView.svelte";
  import Actions from "./components/Actions.svelte";
	import ModalView from "./components/ModalView.svelte";

	let lights, map, actions, modal;
	let height;
</script>

<svelte:window bind:innerHeight={height}/>

<main>
	<Nav {modal} />
	<Lights bind:this={lights} {map} {actions} />
	<MapView bind:this={map} {height} {lights} {modal} {actions} />
	{#if lights !== undefined}
		<Actions bind:this={actions} {lights} {map} />
	{/if}
	<ModalView bind:this={modal} {lights} {map} {actions} />
</main>
