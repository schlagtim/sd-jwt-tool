<script lang="ts">
	import {
		SignatureMode,
		decodeSdJWT,
		formatJsonObject,
		getKBVerifier,
		getVerifier,
	} from "$lib/sd-jwt";
	import Disclosures from "./Disclosures.svelte";
	import Editor from "./Editor.svelte";
	import Signature from "./Signature.svelte";
	import type { JWK, JWTPayload } from "jose";
	import { Disclosure } from "@sd-jwt/utils";

	// This is not yet fetched and only works for the default example

	const publicKeyExampleJwt: JWK = {
		kty: "EC",
		crv: "P-256",
		x: "b28d4MwZMjw8-00CG4xfnn9SLMVMM19SlqZpVb_uNtQ",
		y: "Xv5zWwuoaTgdS6hV43yI6gBwTnjukmFQQnJ_kCxzqk8",
	};
	let encodedJwt: string | undefined =
		"eyJhbGciOiAiRVMyNTYiLCAidHlwIjogInZjK3NkLWp3dCIsICJraWQiOiAiZG9jLXNpZ25lci0wNS0yNS0yMDIyIn0.eyJfc2QiOiBbIjA5dktySk1PbHlUV00wc2pwdV9wZE9CVkJRMk0xeTNLaHBINTE1blhrcFkiLCAiMnJzakdiYUMwa3k4bVQwcEpyUGlvV1RxMF9kYXcxc1g3NnBvVWxnQ3diSSIsICJFa084ZGhXMGRIRUpidlVIbEVfVkNldUM5dVJFTE9pZUxaaGg3WGJVVHRBIiwgIklsRHpJS2VpWmREd3BxcEs2WmZieXBoRnZ6NUZnbldhLXNONndxUVhDaXciLCAiSnpZakg0c3ZsaUgwUjNQeUVNZmVadTZKdDY5dTVxZWhabzdGN0VQWWxTRSIsICJQb3JGYnBLdVZ1Nnh5bUphZ3ZrRnNGWEFiUm9jMkpHbEFVQTJCQTRvN2NJIiwgIlRHZjRvTGJnd2Q1SlFhSHlLVlFaVTlVZEdFMHc1cnREc3JaemZVYW9tTG8iLCAiamRyVEU4WWNiWTRFaWZ1Z2loaUFlX0JQZWt4SlFaSUNlaVVRd1k5UXF4SSIsICJqc3U5eVZ1bHdRUWxoRmxNXzNKbHpNYVNGemdsaFFHMERwZmF5UXdMVUs0Il0sICJpc3MiOiAiaHR0cHM6Ly9leGFtcGxlLmNvbS9pc3N1ZXIiLCAiaWF0IjogMTY4MzAwMDAwMCwgImV4cCI6IDE4ODMwMDAwMDAsICJ2Y3QiOiAiaHR0cHM6Ly9jcmVkZW50aWFscy5leGFtcGxlLmNvbS9pZGVudGl0eV9jcmVkZW50aWFsIiwgIl9zZF9hbGciOiAic2hhLTI1NiIsICJjbmYiOiB7Imp3ayI6IHsia3R5IjogIkVDIiwgImNydiI6ICJQLTI1NiIsICJ4IjogIlRDQUVSMTladnUzT0hGNGo0VzR2ZlNWb0hJUDFJTGlsRGxzN3ZDZUdlbWMiLCAieSI6ICJaeGppV1diWk1RR0hWV0tWUTRoYlNJaXJzVmZ1ZWNDRTZ0NGpUOUYySFpRIn19fQ.QXgzrePAdq_WZVGCwDxP-l8h0iyckrHBNidxVqGtKJ0LMzObqgaXUD1cgGEf7d9TexPkBcgQYqjuzlfbeCxxuA~WyJRZ19PNjR6cUF4ZTQxMmExMDhpcm9BIiwgImFkZHJlc3MiLCB7InN0cmVldF9hZGRyZXNzIjogIjEyMyBNYWluIFN0IiwgImxvY2FsaXR5IjogIkFueXRvd24iLCAicmVnaW9uIjogIkFueXN0YXRlIiwgImNvdW50cnkiOiAiVVMifV0~WyI2SWo3dE0tYTVpVlBHYm9TNXRtdlZBIiwgImVtYWlsIiwgImpvaG5kb2VAZXhhbXBsZS5jb20iXQ~WyJlbHVWNU9nM2dTTklJOEVZbnN4QV9BIiwgImZhbWlseV9uYW1lIiwgIkRvZSJd~WyIyR0xDNDJzS1F2ZUNmR2ZyeU5STjl3IiwgImdpdmVuX25hbWUiLCAiSm9obiJd~eyJhbGciOiAiRVMyNTYiLCAidHlwIjogImtiK2p3dCJ9.eyJub25jZSI6ICIxMjM0NTY3ODkwIiwgImF1ZCI6ICJodHRwczovL2V4YW1wbGUuY29tL3ZlcmlmaWVyIiwgImlhdCI6IDE3MDk5OTYxODUsICJzZF9oYXNoIjogIjc4cFFEazJOblNEM1dKQm5SN015aWpmeUVqcGJ5a01yRnlpb2ZYSjlsN0kifQ.7k4goAlxM4a3tHnvCBCe70j_I-BCwtzhBRXQNk9cWJnQWxxt2kIqCyzcwzzUc0gTwtbGWVQoeWCiL5K6y3a4VQ";

	let jwtHeader = "";
	let jwtPayload = "";
	let disclosures: Array<Disclosure> | undefined;
	let jwtPayloadSelection = {
		digest: "",
		disclosure: "",
	};
	let signatureVerified: SignatureMode;
	let signatureKeyBindingVerified: SignatureMode;
	let showKeyBindingSignatureVerified: boolean = true;
	$: sdJwt = encodedJwt ? decodeSdJWT(encodedJwt) : undefined;
	$: if (sdJwt) {
		sdJwt?.then((sdJwt) => {
			console.log(sdJwt);

			jwtHeader = formatJsonObject(sdJwt.jwt?.header);
			jwtPayload = formatJsonObject(sdJwt.jwt?.payload);
			disclosures = sdJwt.disclosures;

			if (sdJwt.kbJwt && sdJwt.jwt && sdJwt.jwt.payload && sdJwt.jwt.payload.cnf) {
				showKeyBindingSignatureVerified = true;
			} else {
				showKeyBindingSignatureVerified = false;
			}
			sdJwt.kbJwt
				?.verifyKB({
					verifier: getKBVerifier,
					payload: sdJwt.jwt?.payload as JWTPayload,
				})
				.then(() => {
					signatureKeyBindingVerified = SignatureMode.Verified;
				})
				.catch((err) => {
					signatureKeyBindingVerified = SignatureMode.Invalid;
					console.error(err);
				});

			// TODO: Add public key resolution support for issuers
			const alg = sdJwt.jwt!.header!.alg as string;
			sdJwt.jwt
				?.verify(getVerifier(alg, publicKeyExampleJwt))
				.then(() => {
					signatureVerified = SignatureMode.Verified;
				})
				.catch((err) => {
					signatureVerified = SignatureMode.Invalid;
					console.error(err);
				});
		});
	} else {
		jwtHeader = "";
		jwtPayload = "";
		disclosures = undefined;
	}
</script>

<svelte:head>
	<title>SD-JWT</title>
	<meta name="description" content="Tool for SD-JWT inspection" />
</svelte:head>

<section>
	<div class="row" style="width: 90%">
		<div class="column" style="border-top: 0;">
			<Editor
				bind:value={encodedJwt}
				emitChanges={true}
				selectedText={jwtPayloadSelection.disclosure}
				title="Encoded SD-JWT"
			></Editor>
			<Signature
				jwtSignature={signatureVerified}
				keyBindingSignature={signatureKeyBindingVerified}
				showKeyBindingSignature={showKeyBindingSignatureVerified}
			></Signature>
		</div>
		<div class="column" style="border-top: 0;">
			<Editor title="Header" language="json" value={jwtHeader} emitChanges={false} readOnly={true}
			></Editor>
			<Editor
				title="Payload"
				language="json"
				value={jwtPayload}
				emitChanges={false}
				flexSize={4}
				selectedText={jwtPayloadSelection.digest}
				readOnly={true}
			></Editor>
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
		min-height: 100%;
	}

	.row {
		flex: 1;
		display: flex;
		flex-direction: row;
		width: 65%;
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

	@media screen and (max-width: 38em) {
		.row {
			flex-direction: column;
			width: 90%;
		}
	}

	@media screen and (max-width: 90em) {
		.row {
			width: 80%;
		}
	}
</style>
