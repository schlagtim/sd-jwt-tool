<script lang="ts">
	import {
		SignatureMode,
		decodeSdJwt,
		formatJsonObject,
		getDisclosures,
		validateJwtSignature,
	} from "$lib/sd-jwt";
	import type { DisclosureWithDigest } from "@sd-jwt/types";
	import Disclosures from "./Disclosures.svelte";
	import Editor from "./Editor.svelte";
	import Signature from "./Signature.svelte";
	import type { JWK } from "jose";

	// This is not yet fetched and only works for the default example
	const publicKeyExampleJwt: JWK = {
		crv: "Ed25519",
		x: "i_XovdNwR_XoBSkTrZLt9yVQ36KhYbnvbJt0UdrkQTY",
		kty: "OKP",
	};

	let encodedJwt: string | undefined =
		"eyJhbGciOiJFZERTQSIsInR5cCI6InNkLWp3dCJ9.eyJpYXQiOjE3MDgyNzc4Mjg2NjIsImlzcyI6ImRpZDprZXk6c29tZS1yYW5kb20tZGlkLWtleSIsIm5iZiI6MTcwODI3NzgyODc2MiwiY3JlZGVudGlhbCI6eyJfc2QiOlsiSzRrc0gybmU3SFdmRVR6SUZEQmNZZHI4b0Ffc3cwQXk0cXZ2dmJoRjlqRSIsIlJVaWRCLS0xZHBUUEdZS2JiVXRKblZEb3IxNi1WdURHdFE3T2tEa25oUXciLCJzZC1Gd2c1UmhDZ2tOWWt6UktPSVJYUnFqQlBEZU1sZ2V6VC0yNTlDR19ZIiwidXdNcUlneGZGZG55aHhyVzdZYXNSc1JVLXB1dFNhdktOU3RiNWV0ZUJYUSIsInhiaEVQQ053RGhUMGpST2loWmltVnRwVWduRkNtSlBUZzVSNlpabTRQLWsiLCJ5dTRZRmJJOWktZHcySFZPS3ZQU01aWkZPR0hJNUtaYUpNUXlmQmJ3cFNFIl19LCJfc2RfYWxnIjoic2hhLTI1NiIsIl9zZCI6WyI2c0JMdkVmWV9wRURlUEdFc3dnSE1iZ3BDWjJYVHpFZDNfNzRBbXBydlpjIiwiSE5RRFhzanhkWTg1MzBja21TMWRIOEE1MU9TVC1CclpKcktSaWZXeHZmSSIsImhLZnNUdUFnc3JVYmhtQTJCeE81ZlBXdzlLTjFTU05DVkRCNE9XWEdvS1UiXX0.t3ywqNYgweJppEMPkzRc7nMwtiz0HLLJZ5sLtBovGks3zkGbuy2O_MtSowVZN-GQ8RbOoZugFO0LjFQr-oMvCw~WyJBMlpsVGp6S05FZ3dva3REZjZKUmFnIiwiY3JlZGVudGlhbFN1YmplY3QiLCJkaWQ6cGVlcjo0cmVjZWl2ZXItcGVlci1kaWQiXQ~WyI1N2YxMC1WMFh1N1NOSV9DNmVhX1J3IiwiZGF0ZU9mQmlydGgiLCIyMDAwMDEwMSJd~WyIyN1ZUMlowN1R3Z2pMRkNEQjhUYTFnIiwibmFtZSIsIkpvaG4iXQ~WyJyNmJhVmFuM0tVUjR3czRwUzRHTThnIiwibGFzdE5hbWUiLCJEb2UiXQ~eyJ0eXAiOiJrYitqd3QiLCJhbGciOiJFZERTQSJ9.eyJpYXQiOjE3MDgyNzc4Mjg2NjEsImF1ZCI6ImRpZDpwZWVyOjQ6c29tZS12ZXJpZmllciIsIm5vbmNlIjoiZnYtMWtHMDhpSjNOUDRob3E2NVBsUSIsIl9zZF9oYXNoIjoiX1JVZWxtVTVaNDYxeHB4MFhfdHY1M0oyekRXV0NrZmthOW94dkRXVGFBayJ9.clNC-bgPOffqVP1N6cBaxqMUI0sj8K9UonXcD6vfcPI3rzZwmkbIMF_w7WcAGFJ6Xzi14pY7DHAYVrnwu-klCA";
	let jwtHeader = "";
	let jwtPayload = "";
	let disclosures: DisclosureWithDigest[] | undefined;
	let alg: string | undefined;
	let jwtPayloadSelection: string;
	let signatureVerified: SignatureMode;
	let signatureKeyBindingVerified: SignatureMode;
	let showKeyBindingSignatureVerified: boolean = true;

	$: sdJwt = encodedJwt ? decodeSdJwt(encodedJwt) : undefined;
	$: jwtHeader = sdJwt ? formatJsonObject(sdJwt?.header) : "";
	$: jwtPayload = sdJwt ? formatJsonObject(sdJwt?.payload) : "";
	$: alg = sdJwt ? (sdJwt?.payload["_sd_alg"] as string) : undefined;
	$: encodedJwtWithoutDisclosuresAndHolderBinding = encodedJwt
		? encodedJwt.split("~").at(0)
		: undefined;
	$: encodedJwtWithoutDisclosuresAndHolderBinding
		? validateJwtSignature(
				encodedJwtWithoutDisclosuresAndHolderBinding,
				publicKeyExampleJwt,
				sdJwt?.header.alg as string,
			)
				.then((result) => {
					signatureVerified = result ? SignatureMode.Verified : SignatureMode.Invalid;
				})
				.catch(() => {
					signatureVerified = SignatureMode.CouldNotVerify;
				})
		: undefined;
	$: encodedJwtHolderBinding = encodedJwt ? encodedJwt.split("~").at(-1) : undefined;
	$: encodedJwtHolderBinding
		? validateJwtSignature(
				encodedJwtHolderBinding,
				publicKeyExampleJwt,
				sdJwt?.keyBinding?.header?.alg as string,
			)
				.then((result) => {
					showKeyBindingSignatureVerified = true;
					signatureKeyBindingVerified = result ? SignatureMode.Verified : SignatureMode.Invalid;
				})
				.catch(() => {
					showKeyBindingSignatureVerified = true;
					signatureKeyBindingVerified = SignatureMode.CouldNotVerify;
				})
		: (showKeyBindingSignatureVerified = false);
	$: getDisclosures(sdJwt, alg)
		.then((result) => {
			disclosures = result;
		})
		.catch((error) => {
			console.warn(error.message);
			disclosures = [];
		});
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
			<Editor
				title="Payload"
				language="json"
				value={jwtPayload}
				emitChanges={false}
				flexSize={4}
				selectedText={jwtPayloadSelection}
			></Editor>
			<Signature
				jwtSignature={signatureVerified}
				keyBindingSignature={signatureKeyBindingVerified}
				showKeyBindingSignature={showKeyBindingSignatureVerified}
			></Signature>
		</div>
		<div class="column" style="flex: 1;">
			<Disclosures bind:jwtPayloadSelection {disclosures}></Disclosures>
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
		width: 60%;
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

	@media screen and (max-width: 600px) {
		.row {
			flex-direction: column;
			width: 90%;
		}
	}

	@media screen and (max-width: 1450px) {
		.row {
			width: 80%;
		}
	}
</style>
