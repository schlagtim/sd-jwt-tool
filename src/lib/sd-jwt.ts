import { SDJwt } from "@sd-jwt/core";
import { type JwtPayload } from "@sd-jwt/types";

export enum SignatureMode {
	Verified,
	Invalid,
	CouldNotVerify,
}

export function decodeBase64URL(text: string): Uint8Array {
	return Uint8Array.from(atob(text.replace(/-/g, "+").replace(/_/g, "/")), (c) => c.charCodeAt(0));
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

export function getVerifier(alg: string = "ES256", publicKey: Record<string, unknown>) {
	let sig_name: string = "";
	let hash: AlgorithmIdentifier;
	let jwk_alg: string = "";
	switch (alg.toLowerCase()) {
		case "es256":
			sig_name = "ECDSA";
			hash = { name: "SHA-256" };
			jwk_alg = "P-256";
			break;
		case "es384":
			sig_name = "ECDSA";
			hash = { name: "SHA-384" };
			jwk_alg = "P-384";
			break;
		case "es512":
			sig_name = "ECDSA";
			hash = { name: "SHA-512" };
			jwk_alg = "P-512";
			break;
	}
	const enc = new TextEncoder();
	return async (data: string, sigbase64: string) => {
		try {
			const signature = decodeBase64URL(sigbase64);
			// abort validation if inputs are wrong
			if (!jwk_alg || !publicKey || Object.keys(publicKey).length <= 0) {
				return false;
			}
			const pubKey = await crypto.subtle.importKey(
				"jwk",
				publicKey,
				{ name: sig_name, namedCurve: jwk_alg },
				true,
				["verify"],
			);
			return crypto.subtle.verify(
				{
					name: sig_name,
					hash: hash,
				},
				pubKey,
				signature,
				enc.encode(data),
			);
		} catch (_) {
			return false;
		}
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

export async function getHash(raw: string, alg: string = "sha-256"): Promise<Uint8Array> {
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
	return new Uint8Array(await crypto.subtle.digest(browserAlg, enc.encode(raw)));
}
