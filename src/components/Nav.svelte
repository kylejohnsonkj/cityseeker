<script>
	export let modal;
</script>

<nav>
  <button on:click={modal.toggleHelp}>
    <img src="images/help.svg" alt="Help">
  </button>
  <div class="title">Searchle</div>
  <button>
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
	.title {
		flex: 1;
		font-size: 1.5em;
		font-weight: bold;
		text-align: center;
	}
	button {
		background: none;
		border: none;
		cursor: pointer;
	}
</style>