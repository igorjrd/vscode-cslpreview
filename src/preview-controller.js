const vscode= require('vscode');
const PreviewPanel = require('./preview-panel');
const CSLEngine = require('./csl-engine');

module.exports = class PreviewController{
    constructor(manager, textEditor){
        this.manager = manager;
        this.editor = textEditor,
        this.engine = new CSLEngine(this.manager.extensionPath);
        this.panel = new PreviewPanel();
        //callbacks
        vscode.workspace.onDidCloseTextDocument((textDocument) => {
            if (textDocument === this.editor.document){
                this.panel.view.dispose();
            }
        })
        this.panel.view.onDidDispose(()=>{
            this.engine = null;
            this.panel = null;
            this.editor = null;
            this.manager.disposeController(this);
            this.onDidChangeActiveEditor(vscode.window.activeTextEditor);
            vscode.commands.executeCommand('setContext', 'CSLPreviewActive', false);
        })
        vscode.window.onDidChangeActiveTextEditor((textEditor) => {
            this.onDidChangeActiveEditor(textEditor);
        })
    }
    refreshPreview(){
        let style = this.editor.document.getText().toString();
        let bib = this.engine.buildPreviewContent(style);
        this.panel.updateContentHtml(bib);
    }
    onDidChangeActiveEditor(textEditor){
        if(textEditor != undefined){
            if(this.manager.doesDocumentHasPreview(textEditor.document)){
                vscode.commands.executeCommand('setContext', 'cslSourceActive', true);
            }
            else{
                vscode.commands.executeCommand('setContext', 'cslSourceActive', false);
            }
        }else{
            vscode.commands.executeCommand('setContext', 'cslSourceActive', false);
        }
    }
}
