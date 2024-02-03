import * as monaco from "monaco-editor";

import editorWorker from "monaco-editor/esm/vs/editor/editor.worker?worker";
import jsonWorker from "monaco-editor/esm/vs/language/json/json.worker?worker";

self.MonacoEnvironment = {
	getWorker: function (_: string, label: string) {
		switch (label) {
			case "json":
				return new jsonWorker();
			// TODO: Create encoded and decoded SD-JWT worker and syntax definition
			default:
				return new editorWorker();
		}
	},
};

export default monaco;
