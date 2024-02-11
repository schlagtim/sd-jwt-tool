<script lang="ts">
	import { decodeBase64, formatJson, splitJwt } from "$lib/sd-jwt";
	import Editor from "./Editor.svelte";

	let encodedJwt =
		"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";
	let jwtHeader = "";
	let jwtPayload = "";
	let jwtSignature = "";

	$: jwtHeader = formatJson(decodeBase64(splitJwt(encodedJwt)[0]));
	$: jwtPayload = formatJson(decodeBase64(splitJwt(encodedJwt)[1]));
	$: jwtSignature = splitJwt(encodedJwt)[2];
</script>

<svelte:head>
	<title>SD-JWT</title>
	<meta name="description" content="SD-JWT Tool" />
</svelte:head>

<section>
	<div class="row">
		<div class="column" style="border-top: 0;">
			<Editor bind:value={encodedJwt} emitChanges={true} title="Encoded SD-JWT"></Editor>
		</div>
		<div class="column" style="border-top: 0;">
			<Editor title="Header" language="json" value={jwtHeader} emitChanges={false}></Editor>
			<Editor title="Payload" language="json" value={jwtPayload} emitChanges={false}></Editor>
			<Editor title="Signature" value={jwtSignature} emitChanges={false}></Editor>
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
