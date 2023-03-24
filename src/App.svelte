<script>
	import Nav from "./components/Nav.svelte";
	import Lights from "./components/Lights.svelte";
	import MapView from "./components/MapView.svelte";
  import Actions from "./components/Actions.svelte";
	import ModalView from "./components/ModalView.svelte";

	let nav, lights, map, actions, modal;
	let height;
</script>

<svelte:window bind:innerHeight={height}/>

<main>
	{#if lights !== undefined}
		<Nav bind:this={nav} {modal} {lights} />
	{/if}
	<Lights bind:this={lights} {map} {actions} {nav} />
	<MapView bind:this={map} {height} {lights} {modal} {actions} {nav} />
	{#if lights !== undefined}
		<Actions bind:this={actions} {lights} {map} />
	{/if}
	<ModalView bind:this={modal} {lights} {map} {actions} />
</main>
