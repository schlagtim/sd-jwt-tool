import { SDJwt } from "@sd-jwt/core";
import { type JwtPayload } from "@sd-jwt/types";
import { importJWK, type JWK, compactVerify } from "jose";

export enum SignatureMode {
	Verified,
	Invalid,
	CouldNotVerify,
}

export function splitJwt(text: string): string[] {
	return text.split(".");
}

export function decodeBase64URL(text: string): Uint8Array {
	const txt = atob(text.replace(/-/g, "+").replace(/_/g, "/"));
	return Uint8Array.from(txt, (c) => c.charCodeAt(0));
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

export function decodeSdJWT(encodedJwt: string): Promise<SDJwt> {
	return SDJwt.fromEncode(encodedJwt, getHash);
}

export async function validateJwtSignature(
	jwt: string,
	publicKeyJwk: JWK,
	alg?: string,
): Promise<boolean> {
	try {
		const publicKey = await importJWK(publicKeyJwk, alg);

		await compactVerify(jwt, publicKey);

		return true;
	} catch (error) {
		console.error(error);
		console.warn("JWT signature could not be verified");

		return false;
	}
}

export function getVerifier(alg: string = "ES256", publicKey: Record<string, unknown>) {
	let name: string = "";
	let hash: AlgorithmIdentifier;
	let jwk_alg: string = "";
	switch (alg.toLowerCase()) {
		case "es256":
			name = "ECDSA";
			hash = { name: "SHA-256" };
			jwk_alg = "P-256";
			break;
		case "rs384":
			name = "ECDSA";
			hash = { name: "SHA-384" };
			jwk_alg = "P-384";
			break;
		case "es512":
			name = "ECDSA";
			hash = { name: "SHA-512" };
			jwk_alg = "P-512";
			break;
	}
	const enc = new TextEncoder();
	return async (data: string, sigbase64: string) => {
		const signature = decodeBase64URL(sigbase64);
		// abort validation if inputs are wrong
		if (!jwk_alg || !publicKey || Object.keys(publicKey).length <= 0) {
			return false;
		}
		crypto.subtle
			.importKey("jwk", publicKey, { name: name, namedCurve: jwk_alg.toUpperCase() }, true, [
				"verify",
			])
			.then((pubKey) => {
				crypto.subtle
					.verify(
						{
							name: name,
							hash: hash,
						},
						pubKey,
						signature,
						enc.encode(data),
					)
					.then((isValid) => {
						return isValid;
					});
			})
			.catch((err) => {
				console.error(err);
			});
		return false;
	};
}

// TODO: how do we properly get alg if we don't get the header?
export function getKBVerifier(data: string, sig: string, payload: JwtPayload) {
	let alg = payload.cnf ? (payload.cnf.jwk.alg ? payload.cnf.jwk.alg : "") : "";
	if (!alg) {
		switch (payload.cnf?.jwk.crv?.toUpperCase()) {
			case "P-256":
				alg = "ES256";
				break;
			case "P-358":
				alg = "ES358";
				break;
			case "P-512":
				alg = "ES512";
				break;
		}
	}
	const verifier = getVerifier(
		alg,
		payload.cnf ? (payload.cnf.jwk as Record<string, unknown>) : {},
	);
	return verifier(data, sig);
}

export function getHash(raw: string, alg: string = "sha-256"): Uint8Array {
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
	const enc = new TextEncoder();
	crypto.subtle
		.digest(browserAlg, enc.encode(raw))
		.then((val) => {
			return new Uint8Array(val);
		})
		.catch(() => {});
	return new Uint8Array(0);
}
