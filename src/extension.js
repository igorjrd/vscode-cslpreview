const vscode = require("vscode");
const PreviewManager = require("./previews-manager");
const ExtensionCommander = require("./extension-commander");

/**
 * @param {vscode.ExtensionContext} context
 */

function activate(context) {
  const register = vscode.commands.registerCommand;
  const manager = new PreviewManager(context.extensionPath);
  const commander = new ExtensionCommander(manager);
  context.subscriptions.push(
    register("cslPreview.showCslPreview", () => commander.showCslPreview()),
    register("cslPreview.showPreviewSource", () => commander.showSource()),
    register("cslPreview.refreshCslPreview", () => commander.refreshPreview())
  );
}
exports.activate = activate;

function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
