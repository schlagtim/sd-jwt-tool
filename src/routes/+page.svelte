<script lang="ts">
	import { decodeSdJwt, formatJsonObject, provideHasher } from "$lib/sd-jwt";
	import Disclosures from "./Disclosures.svelte";
	import Editor from "./Editor.svelte";
	import type { DisclosureWithDigest } from "@sd-jwt/core/build/sdJwt";

	let encodedJwt: string | undefined =
		"eyJhbGciOiAiRVMyNTYiLCAidHlwIjogInZjK3NkLWp3dCJ9.eyJfc2QiOiBbIjBuOXl6RlNXdktfQlVIaWFNaG0xMmdockN0VmFockdKNl8ta1pQLXlTcTQiLCAiQ2gtREJjTDNrYjRWYkhJd3Rrbm5aZE5VSHRoRXE5TVpqb0ZkZzZpZGlobyIsICJEVzdnRlZaU3V5cjQyWVNZeDhwOHJWS0VrdEp6SjN1RkltZW5tSkJJbWRzIiwgIkkwMGZjRlVvRFhDdWNwNXl5MnVqcVBzc0RWR2FXTmlVbGlOel9hd0QwZ2MiLCAiWDlNYVBhRldtUVlwZkhFZHl0UmRhY2xuWW9FcnU4RXp0QkVVUXVXT2U0NCIsICJkOHFrZlBkb2UyUFlFOTNkNU1fZ0JMMWdabHBGUktDYzBkMWxhb2RfX3MwIiwgImxJM0wwaHNlQ1JXbVVQZzgyVkNVTl9hMTdzTUxfNjRRZ0E0SkZUWURGREUiLCAicHVNcEdMb0FHUmJjc0FnNTBVWjBoaFFMS0NMNnF6eFNLNDMwNGtCbjNfSSIsICJ6VTQ1MmxrR2JFS2g4WnVIXzhLeDNDVXZuMUY0eTFnWkxxbERUZ1hfOFBrIl0sICJpc3MiOiAiaHR0cHM6Ly9waWQtcHJvdmlkZXIubWVtYmVyc3RhdGUuZXhhbXBsZS5ldSIsICJpYXQiOiAxNTQxNDkzNzI0LCAiZXhwIjogMTg4MzAwMDAwMCwgInZjdCI6ICJQZXJzb25JZGVudGlmaWNhdGlvbkRhdGEiLCAiX3NkX2FsZyI6ICJzaGEtMjU2IiwgImNuZiI6IHsiandrIjogeyJrdHkiOiAiRUMiLCAiY3J2IjogIlAtMjU2IiwgIngiOiAiVENBRVIxOVp2dTNPSEY0ajRXNHZmU1ZvSElQMUlMaWxEbHM3dkNlR2VtYyIsICJ5IjogIlp4amlXV2JaTVFHSFZXS1ZRNGhiU0lpcnNWZnVlY0NFNnQ0alQ5RjJIWlEifX19.VStKGOA5TdLsrjahM4dRfDrbsy7BmrUNGw3jaBuxZnHYvmS2EnQ-ib7zSCUVBGGbcyORDFCMd_F6gr8CM9N3WQ~WyIyR0xDNDJzS1F2ZUNmR2ZyeU5STjl3IiwgImZpcnN0X25hbWUiLCAiRXJpa2EiXQ~WyJlbHVWNU9nM2dTTklJOEVZbnN4QV9BIiwgImZhbWlseV9uYW1lIiwgIk11c3Rlcm1hbm4iXQ~WyI2SWo3dE0tYTVpVlBHYm9TNXRtdlZBIiwgIkRFIl0~WyJlSThaV205UW5LUHBOUGVOZW5IZGhRIiwgIm5hdGlvbmFsaXRpZXMiLCBbeyIuLi4iOiAiSnVMMzJRWER6aXpsLUw2Q0xyZnhmanBac1gzTzZ2c2ZwQ1ZkMWprd0pZZyJ9XV0~WyJRZ19PNjR6cUF4ZTQxMmExMDhpcm9BIiwgImJpcnRoX2ZhbWlseV9uYW1lIiwgIlNjaG1pZHQiXQ~WyJBSngtMDk1VlBycFR0TjRRTU9xUk9BIiwgImJpcnRoZGF0ZSIsICIxOTczLTAxLTAxIl0~WyJQYzMzSk0yTGNoY1VfbEhnZ3ZfdWZRIiwgImFkZHJlc3MiLCB7InBvc3RhbF9jb2RlIjogIjEyMzQ1IiwgImxvY2FsaXR5IjogIklyZ2VuZHdvIiwgInN0cmVldF9hZGRyZXNzIjogIlNvbm5lbnN0cmFzc2UgMjMiLCAiY291bnRyeV9jb2RlIjogIkRFIn1d~WyJHMDJOU3JRZmpGWFE3SW8wOXN5YWpBIiwgImlzX292ZXJfMTgiLCB0cnVlXQ~WyJsa2x4RjVqTVlsR1RQVW92TU5JdkNBIiwgImlzX292ZXJfMjEiLCB0cnVlXQ~WyJuUHVvUW5rUkZxM0JJZUFtN0FuWEZBIiwgImlzX292ZXJfNjUiLCBmYWxzZV0~";
	let jwtHeader = "";
	let jwtPayload = "";
	let jwtSignature = "";
	let disclosures: Promise<DisclosureWithDigest[] | undefined> | undefined;
	let alg: any;

	$: sdJWt = encodedJwt ? decodeSdJwt(encodedJwt) : undefined;
	$: jwtHeader = formatJsonObject(sdJWt?.header);
	$: jwtPayload = formatJsonObject(sdJWt?.payload);
	$: jwtSignature = sdJWt?.signature ? sdJWt?.signature.toLocaleString() : "";
	$: alg = sdJWt ? sdJWt?.payload["_sd_alg"] : "";
	$: disclosures = sdJWt ? sdJWt?.withHasher(provideHasher(alg)).disclosuresWithDigest() : undefined;
</script>

<svelte:head>
	<title>SD-JWT</title>
	<meta name="description" content="Tool for SD-JWT inspection" />
</svelte:head>

<section>
	<div class="row">
		<div class="column" style="border-top: 0;">
			<Editor bind:value={encodedJwt} emitChanges={true} title="Encoded SD-JWT"></Editor>
		</div>
		<div class="column" style="border-top: 0;">
			<Editor title="Header" language="json" value={jwtHeader} emitChanges={false}></Editor>
			<Editor title="Payload" language="json" value={jwtPayload} emitChanges={false} flexSize={3}
			></Editor>
			<Editor title="Signature" value={jwtSignature} emitChanges={false}></Editor>
		</div>
		<div class="column" style="flex: 1;">
			{#await disclosures}
			{:then disclosures}
				<Disclosures {disclosures}></Disclosures>
			{:catch error}
				<p style="color: red">{error.message}</p>
			{/await}
		</div>
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
