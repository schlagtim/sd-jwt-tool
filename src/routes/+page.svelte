<script lang="ts">
	import { SignatureMode, formatJsonObject } from "$lib/sd-jwt";
	import Disclosures from "./Disclosures.svelte";
	import Editor from "./Editor.svelte";
	import Signature from "./Signature.svelte";
	import { Disclosure } from "@sd-jwt/utils";
	import { ES256, digest, generateSalt } from "@sd-jwt/crypto-browser";
	import {
		ES256 as NodeES256,
		digest as NodeDigest,
		generateSalt as NodeGenerateSalt,
	} from "@sd-jwt/crypto-nodejs";
	import { SDJwtVcInstance } from "@sd-jwt/sd-jwt-vc";
	import type {
		DisclosureFrame,
		PresentationFrame,
		Signer,
		KbVerifier,
		JwtPayload,
	} from "@sd-jwt/types";
	import { onMount } from "svelte";
	import { SDJwt } from "@sd-jwt/core";

	let holderKey: { privateKey: JsonWebKey; publicKey: JsonWebKey };
	async function getInstance() {
		/**
		 * Get the instance based on the environment. Since svelte uses SSR, we need to check if we are in the browser or not.
		 */
		if (typeof window !== "undefined") {
			const { privateKey, publicKey } = await ES256.generateKeyPair();
			const signer = await ES256.getSigner(privateKey);
			const verifier = await ES256.getVerifier(publicKey);

			holderKey = await ES256.generateKeyPair();
			const kbSigner: Signer = async (data: string) =>
				ES256.getSigner(holderKey.privateKey).then((signer) => signer(data));
			const kbVerifier: KbVerifier = async (data: string, key: string, payload: JwtPayload) => {
				if (!payload.cnf) {
					throw new Error("No cnf in payload");
				}
				return ES256.getVerifier(payload.cnf.jwk).then((verifier) => verifier(data, key));
			};

			// define an instance that can be used for everything. In case of validation, we only need the verifier and hash functions.
			return new SDJwtVcInstance({
				signer,
				verifier,
				signAlg: "EdDSA",
				hasher: digest,
				hashAlg: "SHA-256",
				saltGenerator: generateSalt,
				kbSignAlg: "EdDSA",
				kbSigner,
				kbVerifier,
			});
		} else {
			const { privateKey, publicKey } = await NodeES256.generateKeyPair();
			const signer = await NodeES256.getSigner(privateKey);
			const verifier = await NodeES256.getVerifier(publicKey);
			holderKey = await ES256.generateKeyPair();
			const kbSigner: Signer = async (data: string) =>
				ES256.getSigner(holderKey.privateKey).then((signer) => signer(data));
			const kbVerifier: KbVerifier = async (data: string, key: string, payload: JwtPayload) => {
				if (!payload.cnf) {
					throw new Error("No cnf in payload");
				}
				return ES256.getVerifier(payload.cnf.jwk).then((verifier) => verifier(data, key));
			};
			return new SDJwtVcInstance({
				signer,
				verifier,
				signAlg: "EdDSA",
				hasher: NodeDigest,
				hashAlg: "SHA-256",
				saltGenerator: NodeGenerateSalt,
				kbSignAlg: "EdDSA",
				kbSigner,
				kbVerifier,
			});
		}
	}
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
	let encodedJwt: string;
	let instance: SDJwtVcInstance;
	/**
	 * Set the values to create a default SD-JWT-VC
	 */
	const claims = {
		firstname: "Jon",
		lastname: "Doe",
	};
	const disclosureFrame: DisclosureFrame<typeof claims> = {
		_sd: ["firstname", "lastname"],
	};
	const presentationFrame: PresentationFrame<typeof claims> = {
		firstname: true,
	};
	const requiredClaims = ["firstname"];

	onMount(async () => {
		instance = await getInstance();
		encodedJwt = await instance.issue(
			{
				...claims,
				iss: "issuer",
				iat: new Date().getTime() / 1000,
				vct: "",
				cnf: { jwk: holderKey.publicKey },
			},
			disclosureFrame,
		);
		encodedJwt = await instance.present(encodedJwt, presentationFrame, {
			kb: {
				payload: {
					aud: "1",
					iat: 1,
					nonce: "342",
				},
			},
		});
	});
	const hasher = typeof window !== "undefined" ? digest : NodeDigest;
	$: sdJwt = encodedJwt ? SDJwt.fromEncode(encodedJwt, hasher) : undefined;
	$: if (sdJwt) {
		sdJwt?.then((sdJwt) => {
			jwtHeader = formatJsonObject(sdJwt.jwt?.header);
			jwtPayload = formatJsonObject(sdJwt.jwt?.payload);
			disclosures = sdJwt.disclosures;
			if (sdJwt.kbJwt && sdJwt.jwt && sdJwt.jwt.payload && sdJwt.jwt.payload.cnf) {
				showKeyBindingSignatureVerified = true;
			} else {
				showKeyBindingSignatureVerified = false;
			}
			instance
				.verify(encodedJwt, requiredClaims, false)
				.then(() => {
					signatureVerified = SignatureMode.Verified;
				})
				.catch((err) => {
					signatureVerified = SignatureMode.Invalid;
					console.error(err);
				});
			if (sdJwt.kbJwt) {
				instance
					.verify(encodedJwt, requiredClaims, true)
					.then(() => {
						signatureKeyBindingVerified = SignatureMode.Verified;
					})
					.catch((err) => {
						signatureKeyBindingVerified = SignatureMode.Invalid;
						console.error(err);
					});
			}
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
			<Editor title="Header" language="json" value={jwtHeader} emitChanges={false}></Editor>
			<Editor
				title="Payload"
				language="json"
				value={jwtPayload}
				emitChanges={false}
				flexSize={4}
				selectedText={jwtPayloadSelection.digest}
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
