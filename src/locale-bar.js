const vscode = require('vscode');
const dict = require('./nls')

module.exports = class LocaleBar{
    constructor(extensionPath){
        this.extensionPath = extensionPath;
        this.bar = vscode.window.createStatusBarItem(2, 10000);
        this.bar.text = "$(ports-open-browser-icon)";
        this.bar.command = 'cslPreview.chooseLocale';
        this.bar.tooltip = dict['cslPreview.chooseLocale.title'];
    }
}