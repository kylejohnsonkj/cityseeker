<script>
	import { slide } from 'svelte/transition';
	
	export let lights;
	export let modal;

	let currentRound = lights._getCurrentRound();
  let region = "";
  
  export function updateCurrentRound(newRound) {
    currentRound = newRound;
  }
  
  export function updateRegion(newRegion) {
    region = newRegion;
  }
</script>

<nav>
  <button on:click={modal.toggleHelp}>
    <img src="images/help.svg" alt="Help">
  </button>
  <div class="title-container">
		<img id="logo" src="images/logo.svg" alt="City Seeker">
		{#if region != ""}
			<div class="info" transition:slide>
				<span class="roundSpan">
					Round <span class="round">{currentRound + 1}</span> of {lights.maxRounds}
				</span>
				<span class="regionSpan">
					Region: <span class="region">{region}</span>
				</span>
			</div>
		{/if}
	</div>
  <button on:click={lights.restartGame}>
    <img src="images/stats.svg" alt="Stats">
  </button>
</nav>

<style>
	nav {
		display: flex;
		align-items: center;
		justify-content: center;
		border-bottom: 1px solid lightgray;
	}
	nav > * {
		padding: 10px 15px;
	}
	.title-container {
		flex: 1;
		text-align: center;
	}
	#logo {
		flex: 1;
		height: 30px;
	}
	.info {
		margin-top: 3px;
	}
	.round {
		font-weight: bold;
		color: var(--red);
	}
	.region {
		font-weight: bold;
		color: var(--green);
	}
	.regionSpan::before {
			content: "- ";
		}
	@media (max-width: 400px) {
    .regionSpan {
			display: block;
		}
		.regionSpan::before {
			content: "";
		}
  }
	button {
		background: none;
		border: none;
		cursor: pointer;
	}
</style>