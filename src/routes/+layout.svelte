<script>
	import "./styles.css";
</script>

<div class="app">
	<header>
		<h1>SD-JWT</h1>
		<span>Tool for SD-JWT VC inspection</span>
		<p class="links">
			<span><a href="https://datatracker.ietf.org/doc/html/rfc7519">JWT</a> </span>
			<span
				><a
					href="https://drafts.oauth.net/oauth-selective-disclosure-jwt/draft-ietf-oauth-selective-disclosure-jwt.html"
					>SD-JWT</a
				>
				| <a href="https://github.com/oauth-wg/oauth-selective-disclosure-jwt">(GitHub)</a></span
			>
			<span>
				<a href="https://drafts.oauth.net/oauth-sd-jwt-vc/draft-ietf-oauth-sd-jwt-vc.html"
					>SD-JWT-VC</a
				>
				| <a href="https://github.com/oauth-wg/oauth-sd-jwt-vc">(GitHub)</a>
			</span>
			<span>
				<a
					href="https://vcstuff.github.io/draft-ietf-oauth-status-list/draft-ietf-oauth-status-list.html"
					>OAuth Status List</a
				>
				| <a href="https://github.com/vcstuff/draft-ietf-oauth-status-list">(GitHub)</a>
			</span>
		</p>
	</header>

	<main>
		<slot />
	</main>

	<footer><p><a href="https://github.com/schlagtim/sd-jwt-tool">SD-JWT Tool GitHub</a></p></footer>
</div>

<style>
	.app {
		display: flex;
		flex-direction: column;
		min-height: 100%;
		width: 100%;
	}

	.links {
		display: flex;
		flex-direction: row;
		justify-content: space-around;
		width: 70%;
		text-align: center;

		margin-bottom: 2rem;
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

	@media screen and (max-width: 600px) {
		.links {
			flex-direction: column;
		}

		.app {
			min-height: 400%;
		}
	}
</style>
