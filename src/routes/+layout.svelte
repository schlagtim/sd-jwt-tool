<script>
	import "./styles.css";
</script>

<div class="app">
	<header>
		<h1>SD-JWT</h1>

		<p>Tool for SD-JWT VC inspection</p>
	</header>

	<main>
		<slot />
	</main>

	<footer><p></p></footer>
</div>

<style>
	.app {
		display: flex;
		flex-direction: column;
		height: 100%;
		width: 100%;
	}

	main {
		display: flex;
		flex: 1;
		flex-direction: column;
		width: 100%;
		margin: 0 auto;
	}

	header {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	footer {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}
</style>
