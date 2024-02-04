<script lang="ts">
	import Editor from "./Editor.svelte";
</script>

<svelte:head>
	<title>SD-JWT</title>
	<meta name="description" content="SD-JWT Tool" />
</svelte:head>

<section>
	<div class="row">
		<div class="column" style="border-top: 0;">
			<Editor title="Encoded SD-JWT"></Editor>
		</div>
		<div class="column" style="border-top: 0;">
			<Editor title="Header"></Editor>
			<Editor title="Payload"></Editor>
			<Editor title="Signature"></Editor>
		</div>
		<!--
		<div class="column" style="flex: 1;">
			<h3>More information</h3>
			<div class="infotab">Some information...</div>
		</div>
		-->
	</div>
</section>

<style>
	section {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		height: 100%;
	}

	.row {
		flex: 1;
		display: flex;
		flex-direction: row;
		width: 80%;
	}

	.column {
		display: flex;
		flex-direction: column;
		flex: 2;

		border-color: black;
		border-style: solid;
		border-width: 1px;

		margin: 0px 0px 0px 0.5rem;
		min-width: 0;
	}
</style>
