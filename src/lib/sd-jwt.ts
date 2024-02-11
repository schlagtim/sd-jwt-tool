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
