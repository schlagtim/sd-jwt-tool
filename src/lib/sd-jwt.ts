import {
	SdJwt,
	type HasherAndAlgorithm,
	HasherAlgorithm,
	type Verifier,
	type VerifyOptions,
} from "@sd-jwt/core";
import type { DisclosureWithDigest } from "@sd-jwt/types";
import * as jose from "jose";

export enum SignatureMode {
	Verified,
	Invalid,
	CouldNotVerify,
}

export type DisclosureType = {
	salt: string;
	key?: string;
	value: any;
	digest: string;
};

export function splitJwt(text: string): string[] {
	return text.split(".");
}

export function decodeBase64(text: string) {
	let result: string = "";
	try {
		result = atob(text);
	} catch (error) {
		console.warn("Not correctly encoded", error);
	}
	return result;
}

export function encodeBase64(text: string) {
	return btoa(encodeURIComponent(text));
}

export function formatJson(text: string) {
	let result: string = "";

	try {
		result = JSON.stringify(JSON.parse(text), null, "\t");
	} catch (error) {
		console.warn("Could not format JSON", error);
	}

	return result;
}

export function formatJsonObject(json: unknown) {
	let result: string = "";

	if (!json) {
		return "";
	}

	try {
		result = JSON.stringify(json, null, "\t");
	} catch (error) {
		console.warn("Could not format JSON", error);
	}

	return result;
}

export function decodeSdJwt(encodedJwt: string) {
	try {
		return SdJwt.fromCompact(encodedJwt);
	} catch (error) {
		return undefined;
	}
}

export async function validateJwtSignature(
	jwt: string,
	publicKeyJwk: jose.JWK,
	alg?: string,
): Promise<boolean> {
	try {
		const publicKey = await jose.importJWK(publicKeyJwk, alg);
		await jose.jwtVerify(jwt, publicKey);

		return true;
	} catch (error) {
		console.warn("JWT signature could not be verified");

		return false;
	}
}

export async function getDisclosures(
	sdJwt?: SdJwt,
	alg?: string,
): Promise<DisclosureWithDigest[] | undefined> {
	try {
		const disclosures = await sdJwt?.withHasher(provideHasher(alg)).disclosuresWithDigest();

		return disclosures ? disclosures.map((disclosure) => disclosure.asJson()) : [];
	} catch (error) {
		console.warn((error as Error).message);

		return [];
	}
}

export function provideHasher(alg: string = "sha-256") {
	let browserAlg: string = "";
	switch (alg.toLowerCase()) {
		case "sha-256":
			browserAlg = "SHA-256";
			break;
		case "sha-384":
			browserAlg = "SHA-384";
			break;
		case "sha-512":
			browserAlg = "SHA-512";
			break;
	}
	var enc = new TextEncoder();
	const hasherAndAlgorithm: HasherAndAlgorithm = {
		hasher: (input: string) =>
			crypto.subtle
				.digest(browserAlg, enc.encode(input))
				.then((val) => {
					return new Uint8Array(val);
				})
				.catch((err) => {
					return new Uint8Array(0);
				}),
		algorithm: alg,
	};
	return hasherAndAlgorithm;
}
