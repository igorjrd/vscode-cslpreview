const vscode = require("vscode");
const PreviewPanel = require("./preview-panel");
const CSLEngine = require("./csl-engine");
const utils = require("./utils");

module.exports = class PreviewController {
  constructor(manager, textEditor) {
    this.manager = manager;
    (this.editor = textEditor),
      (this.engine = new CSLEngine(this.manager.extensionPath));
    this.panel = new PreviewPanel();
    //callbacks
    vscode.workspace.onDidCloseTextDocument((textDocument) => {
      if (textDocument === this.editor.document) {
        this.panel.view.dispose();
      }
    });
    this.panel.view.onDidDispose(() => {
      this.engine = null;
      this.panel = null;
      this.editor = null;
      this.manager.disposeController(this);
      this.onDidChangeActiveEditor(vscode.window.activeTextEditor);
    });
    vscode.window.onDidChangeActiveTextEditor((textEditor) => {
      this.onDidChangeActiveEditor(textEditor);
    });
  }
  showPreview() {
    let style = this.editor.document.getText().toString();

    let bib = this.engine.buildPreviewContent(style);

    this.panel.updateContentHtml(bib);
  }

  refreshPreview() {
    if (this.manager.filePath) {
      let citables = utils.getCitablesFromJson(this.manager.filePath);
      this.engine.updateCitables(citables);
    }

    this.showPreview();
  }
  onDidChangeActiveEditor(textEditor) {
    if (textEditor != undefined) {
      if (this.manager.doesDocumentHasPreview(textEditor.document)) {
        vscode.commands.executeCommand("setContext", "cslSourceActive", true);
      } else {
        vscode.commands.executeCommand("setContext", "cslSourceActive", false);
      }
    } else {
      vscode.commands.executeCommand("setContext", "cslSourceActive", false);
    }
  }
};
