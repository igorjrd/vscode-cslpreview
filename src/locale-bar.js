const vscode = require('vscode');

module.exports = class LocaleBar{
    constructor(extensionPath){
        this.extensionPath = extensionPath;
        this.bar = vscode.window.createStatusBarItem(2, 10000);
        this.bar.text = "$(ports-open-browser-icon)"
        this.bar.command = 'cslPreview.chooseLocale'
    }
}