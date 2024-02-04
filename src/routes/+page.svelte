<script lang="ts">
	import { onDestroy, onMount } from "svelte";
	import type * as Monaco from "monaco-editor/esm/vs/editor/editor.api";
	import Editor from "./Editor.svelte";

	let editor: Monaco.editor.IStandaloneCodeEditor;
	let monaco: typeof Monaco;
	let editorEncodedSdJwtElement: HTMLElement;
	let editorDecodedHeaderElement: HTMLElement;
	let editorDecodedPayloadElement: HTMLElement;
	let editorSignatureElement: HTMLElement;

	onMount(async () => {
		// Import our 'monaco.ts' file here
		// (onMount() will only be executed in the browser, which is what we want)
		monaco = (await import("./monaco")).default;

		monaco.languages.registerDocumentFormattingEditProvider("json", {
			provideDocumentFormattingEdits(model, options, token) {
				const formatted = JSON.stringify(JSON.parse(model.getValue()), null, "\t");

				return [
					{
						range: model.getFullModelRange(),
						text: formatted,
					},
				];
			},
		});

		const sharedEditorSettings: Monaco.editor.IStandaloneEditorConstructionOptions = {
			autoIndent: "full",
			formatOnPaste: true,
			formatOnType: true,
			tabSize: 2,
			automaticLayout: true,
			minimap: {
				enabled: false,
			},
		};

		const editorEncodedSdJwt = monaco.editor.create(
			editorEncodedSdJwtElement,
			sharedEditorSettings,
		);
		const editorDecodedHeader = monaco.editor.create(
			editorDecodedHeaderElement,
			sharedEditorSettings,
		);
		const editorDecodedPayload = monaco.editor.create(
			editorDecodedPayloadElement,
			sharedEditorSettings,
		);
		const editorSignature = monaco.editor.create(editorSignatureElement, sharedEditorSettings);

		const exampleJson =
			'{"this":"is","an":"example","json":[{"one":1},2,{"three":3 }],"it_should_be_an_encoded":"sd-jwt"}';
		const headerDummyText = '{"alg":"HS256","typ":"JWT"}';
		const payloadDummyText = '{"sub":"1234567890","name":"John Doe","iat":1516239022}';
		const signatureDummyText = "signature...";

		const modelEncodedSdJwt = monaco.editor.createModel(exampleJson, "json");
		const modelDecodedHeader = monaco.editor.createModel(headerDummyText, "json");
		const modelDecodedPayload = monaco.editor.createModel(payloadDummyText, "json");
		const modelSignature = monaco.editor.createModel(signatureDummyText, "json");

		editorEncodedSdJwt.setModel(modelEncodedSdJwt);
		editorDecodedHeader.setModel(modelDecodedHeader);
		editorDecodedPayload.setModel(modelDecodedPayload);
		editorSignature.setModel(modelSignature);

		setTimeout(() => {
			try {
				editorEncodedSdJwt.getAction("editor.action.formatDocument")?.run();
				editorDecodedHeader.getAction("editor.action.formatDocument")?.run();
				editorDecodedPayload.getAction("editor.action.formatDocument")?.run();
				editorSignature.getAction("editor.action.formatDocument")?.run();
			} catch (error) {
				console.warn("JSON is not correct");

				return;
			}
		}, 1000);
	});

	onDestroy(() => {
		monaco?.editor.getModels().forEach((model) => model.dispose());
		editor?.dispose();
	});
</script>

<svelte:head>
	<title>SD-JWT</title>
	<meta name="description" content="SD-JWT Tool" />
</svelte:head>

<section>
	<div class="row">
		<div class="column" style="border-top: 0;">
			<Editor title="Encoded SD-JWT"></Editor>
		</div>
		<div class="column" style="border-top: 0;">
			<Editor title="Header"></Editor>
			<Editor title="Payload"></Editor>
			<Editor title="Signature"></Editor>
		</div>
		<!--
		<div class="column" style="flex: 1;">
			<h3>More information</h3>
			<div class="infotab">Some information...</div>
		</div>
		-->
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
