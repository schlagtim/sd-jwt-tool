<script lang="ts">
	import { decodeBase64, formatJson, formatJsonObject, splitJwt, decodeSdJwt } from "$lib/sd-jwt";
	import { Disclosure, SdJwt } from "@sd-jwt/core";
	import Disclosures from "./Disclosures.svelte";
	import Editor from "./Editor.svelte";

	let encodedJwt =
		"eyJhbGciOiJFZERTQSIsInR5cCI6InNkLWp3dCJ9.eyJpYXQiOjE3MDc2NjcxNTM2MzQsImlzcyI6ImRpZDprZXk6c29tZS1yYW5kb20tZGlkLWtleSIsIm5iZiI6MTcwNzY2NzE1MzczNCwiY3JlZGVudGlhbCI6eyJfc2QiOlsiNjRkUkN0YllkVkVMYW90eDBRVlFMZEdqcm9RSG1OUEI0TmI4b1BzbnE3YyIsIjZBMHF6TDQtZ3hrSkFuQ1EtSzN6b2hMYXo2Qzh3TUhXei0tSW41eFdsZmMiLCI2UFgxYXRrNEtpdm5NRDlSZjBMcF9LV2JBRkJVT1RPQjN1NzFmZzRPZ2NrIiwiWE4tZzluLXphODViVnhPaWlQUXF2Vl9VVmtLdG04VXlWbFZJZElCU3ltNCIsIm5Xc29GQ2V1cnFLZzJDbmFEeUxKMXV5UUtNUmtPdFFNMV95dUtaTjR5VlEiLCJ2bnBZcU1qOTdVMUZPX3VzRHhacWZVcl84Z2ZvdkpfdDNpVmo1OWtfZGkwIl19LCJfc2RfYWxnIjoic2hhLTI1NiIsIl9zZCI6WyJFX2N2SWNYOGYzYnZFNXVNVzctNEp5ZnNNMkNycUFhLVBjOU15MmtNaGFNIiwidlcxdWJSTUotVFBlRzIzS0J1OElleXlNeXVJRG5QNDB3SzR0YmRjbDdxdyIsInl5aTItMVJLaVNiR2YyY3hyX2VkQkljbVNUdzJMSVQ4dWUwVm1RemNpeTgiXX0.zeCXWQgiWFJIFZBVC9GKKSilJ--6u8OIQ4AnDRopKN4KQtYS8Z98ORxWb3_bDOdmNEHDvMqtAkEvxqk08_USCQ~WyJpSFFLaDlFM3BxZUluLXFvelVMMU93IiwiY3JlZGVudGlhbFN1YmplY3QiLCJkaWQ6cGVlcjo0cmVjZWl2ZXItcGVlci1kaWQiXQ~WyJxYzlObkVjeVA4YmsxV2RKTE53c1BBIiwiZGF0ZU9mQmlydGgiLCIyMDAwMDEwMSJd~WyJvVXJsUnNfRzlncWlQN2o4TDhPekd3IiwibmFtZSIsIkpvaG4iXQ~WyJpeld6c3BQMzUxdm55dzN0eno0blNnIiwibGFzdE5hbWUiLCJEb2UiXQ~eyJ0eXAiOiJrYitqd3QiLCJhbGciOiJFZERTQSJ9.eyJpYXQiOjE3MDc2NjcxNTM2MzMsImF1ZCI6ImRpZDpwZWVyOjQ6c29tZS12ZXJpZmllciIsIm5vbmNlIjoiaVloOXBoU3ZWWTFVcUpsX05pNklJUSIsIl9zZF9oYXNoIjoiRTYwNWJfbnJPallsdUlSbktfQThKNTNhemwwcG8wcThBbHBJczZrQm5JWSJ9.6ZAydMHRVByM02Z79zQSWuZU3ZfNIkmVrMXM2ZVR-nN92h_J9D5-2cB7gPZ3aDP3Z-BY1Wj2kp_cIakv5ji3Cw";
	let jwtHeader = "";
	let jwtPayload = "";
	let jwtSignature = "";
	let disclosures: Disclosure[] = [];

	$: sdJWt = encodedJwt ? decodeSdJwt(encodedJwt) : undefined;
	$: jwtHeader = formatJsonObject(sdJWt?.header);
	$: jwtPayload = formatJsonObject(sdJWt?.payload);
	$: jwtSignature = sdJWt?.signature ? sdJWt?.signature.toLocaleString() : "";
	$: disclosures = sdJWt?.disclosures ? sdJWt?.disclosures : [];
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
			<Editor title="Payload" language="json" value={jwtPayload} emitChanges={false}></Editor>
			<Editor title="Signature" value={jwtSignature} emitChanges={false}></Editor>
		</div>
		<div class="column" style="flex: 1;">
			<Disclosures {disclosures}></Disclosures>
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
