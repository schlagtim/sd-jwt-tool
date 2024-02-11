import { SdJwt } from "@sd-jwt/core";

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

export function formatJsonObject(json: any) {
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
