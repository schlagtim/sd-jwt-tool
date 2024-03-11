<script lang="ts">
	import type * as Monaco from "monaco-editor/esm/vs/editor/editor.api";
	import { onDestroy, onMount } from "svelte";

	export let value = "";
	export let title: string = "Editor";
	export let language: string = "customSdJwt";
	export let emitChanges = true;
	export let flexSize: number = 1;
	export let selectedText: string = "";
	export let readOnly: boolean = false;

	let monaco: typeof Monaco;
	let editorElement: HTMLElement;
	let editorInstance: Monaco.editor.IStandaloneCodeEditor;
	let selectText: any = null;

	onMount(async () => {
		monaco = (await import("./monaco")).default;

		/*
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
		*/

		editorInstance = monaco.editor.create(editorElement, {
			autoIndent: "full",
			formatOnPaste: true,
			formatOnType: true,
			wordWrap: "on",
			fontFamily: "Fira Mono",
			// theme: "vs-dark",
			tabSize: 2,
			automaticLayout: true,
			readOnly: readOnly,
			linkedEditing: true,
			minimap: {
				enabled: false,
			},
		});

		var myLanguage = {
			tokenizer: {
				root: [
					// Initial JWT
					[/^[^.]+?\.[^.]+?\.[^.]+?(?=~)~/, "sdJwt"],

					// Disclosure strings
					[/([^~]+)~/, "disclosureStrings"],

					[/([^.]+?\.[^.]+?\.[^.]+?)$/, "keyBindingJwt"],

					[/(~)/, "tilde"],
				],
			},
		};

		monaco.languages.register({ id: "customSdJwt" });

		monaco.languages.setMonarchTokensProvider("customSdJwt", myLanguage as any);

		monaco.editor.defineTheme("myCustomTheme", {
			colors: {},
			base: "vs", // can also be vs-dark or hc-black
			inherit: true, // inherit from base theme
			rules: [
				{ token: "tilde", foreground: "ff00ff" },
				{ token: "sdJwt", foreground: "a31515" },
				{
					token: "disclosureStrings",
					foreground: "098658",
					fontStyle: "italic",
				},
				{ token: "keyBindingJwt", foreground: "0451a5" },
			],
		});

		monaco.editor.setTheme("myCustomTheme");

		const modelEncoded = monaco.editor.createModel(value, language);

		editorInstance.setModel(modelEncoded);

		/*
		try {
			editorInstance.getAction("editor.action.formatDocument")?.run();
		} catch (error) {
			console.warn("JSON is not correct");

			return;
		}
		*/

		if (emitChanges) {
			editorInstance.onDidChangeModelContent((event) => {
				value = editorInstance.getValue();
			});
		}

		selectText = (substring: string) => {
			const matches: Monaco.editor.FindMatch[] | undefined = editorInstance
				.getModel()
				?.findMatches(substring, true, false, false, null, true);

			if (matches && matches.length > 0) {
				editorInstance.setSelection(matches[0].range);
			}
		};
	});

	$: if (editorInstance && !emitChanges) {
		editorInstance.setValue(value);
	}
	$: if (selectText != null) {
		selectedText ? selectText(selectedText) : undefined;

		// console.log("setting hover target", selectedText);
	}

	onDestroy(() => {
		monaco?.editor.getModels().forEach((model) => model.dispose());
		editorInstance?.dispose();
	});
</script>

<div class="box" style="--flex-size: {flexSize}">
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
		flex: var(--flex-size);

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
