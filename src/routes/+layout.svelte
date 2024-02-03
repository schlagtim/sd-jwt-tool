<script>
	import "./styles.css";
</script>

<div class="app">
	<header>
		<h1>SD-JWT</h1>

		<p>This is the header</p>
	</header>

	<main>
		<slot />
	</main>

	<footer>This is the footer</footer>
</div>

<style>
	.app {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
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
