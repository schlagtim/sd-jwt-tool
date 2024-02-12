import { SdJwt, type HasherAndAlgorithm, HasherAlgorithm } from "@sd-jwt/core";

export function splitJwt(text: string): string[] {
	const result = text.split(".");
	console.log(result);
	return result;
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
		console.warn(error);

		return undefined;
	}
}

export default crypto;
export function provideHasher(alg: string) {
	let browserAlg: string = '';
	switch (alg.toLowerCase()) {
		case 'sha-256':
			browserAlg = "SHA-256"
			break;
		case 'sha-384':
			browserAlg = "SHA-384"
			break;
		case 'sha-512':
			browserAlg = "SHA-512"
			break;
	}
	var enc = new TextEncoder();
	const hasherAndAlgorithm: HasherAndAlgorithm = {
		// TODO: how do you properly cast this?
		hasher: (input: string) => crypto.subtle.digest(browserAlg, enc.encode(input)).then((val) => {
			return new Uint8Array(val);
		}).catch((err) => {
			return new Uint8Array(0);
		}),
		algorithm: alg,
	}
	return hasherAndAlgorithm;
}