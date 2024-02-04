<script lang="ts">
	import { onDestroy, onMount } from "svelte";
	import type * as Monaco from "monaco-editor/esm/vs/editor/editor.api";

	export let title: string = "Editor";

	let monaco: typeof Monaco;
	let editor: Monaco.editor.IStandaloneCodeEditor;
	let editorElement: HTMLElement;

	onMount(async () => {
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

		const editorInstance = monaco.editor.create(editorElement, {
			autoIndent: "full",
			formatOnPaste: true,
			formatOnType: true,
			// theme: "vs-dark",
			tabSize: 2,
			automaticLayout: true,
			minimap: {
				enabled: false,
			},
		});

		const exampleJson =
			'{"this":"is","an":"example","json":[{"one":1},2,{"three":3 }],"it_should_be_an_encoded":"sd-jwt"}';

		const modelEncoded = monaco.editor.createModel(exampleJson, "json");

		editorInstance.setModel(modelEncoded);

		setTimeout(() => {
			try {
				editorInstance.getAction("editor.action.formatDocument")?.run();
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

<div class="box">
	<div class="stripes">
		<h5>{title.toUpperCase()}</h5>
	</div>
	<div class="editor" bind:this={editorElement} />
</div>

<style>
	h5 {
		margin: 0.5rem;
		text-align: center;
	}

	.stripes {
		border-color: black;
		border-style: solid;
		border-width: 1px;
		border-left: 0;
		border-right: 0;
	}

	.box {
		flex: 1;
		display: flex;
		flex-direction: column;

		/*border-radius: 1rem 1rem 0 0;
		margin-bottom: 0.5rem;*/

		background-color: #fffffe;
	}

	.editor {
		flex: 1;
	}
</style>
