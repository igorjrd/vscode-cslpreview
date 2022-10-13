const vscode = require('vscode');
const PreviewManager = require('./previews-manager');
const ExtensionCommander = require('./extension-commander');
const LocaleBar = require('./locale-bar');

/**
 * @param {vscode.ExtensionContext} context
 */

function activate(context) {
	const register = vscode.commands.registerCommand;
	const localeBar = new LocaleBar(context.extensionPath);
	const manager = new PreviewManager(context.extensionPath, localeBar);
	const commander = new ExtensionCommander(manager);
	context.subscriptions.push(
		register('cslPreview.showCslPreview', () => commander.showCslPreview()),
		register('cslPreview.refreshCslPreview', () => commander.refreshPreview()),
		register('cslPreview.showPreviewSource', () => commander.showSource()),
		register('cslPreview.chooseLocale', () => commander.chooseLocale())
	);
}
exports.activate = activate;

function deactivate() {}

module.exports = {
	activate,
	deactivate
}