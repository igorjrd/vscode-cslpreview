const PreviewController = require("./preview-controller");
const vscode = require("vscode");

module.exports = class PreviewManager {
  constructor(extensionPath) {
    this.extensionPath = extensionPath;
    this.controllers = [];
    this.filePath = null;
  }
  createController(citables) {
    let editor = vscode.window.activeTextEditor;
    let _controller = new PreviewController(this, editor);
    _controller.engine.updateCitables(citables);
    _controller.showPreview();
    this.controllers.push(_controller);
  }
  disposeController(_controller) {
    let index = this.controllers.indexOf(_controller);
    this.controllers.splice(index, 1);
  }
  doesDocumentHasPreview(document) {
    return this.controllers.some(
      (controller) => controller.editor.document === document
    );
  }
  getControllerFromDocument(document) {
    return this.controllers.find(
      (controller) => controller.editor.document === document
    );
  }
  getControllerFromActiveWebview() {
    return this.controllers.find(
      (controller) => controller.panel.view.active == true
    );
  }
};
