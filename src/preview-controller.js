const vscode= require('vscode');
const PreviewPanel = require('./preview-panel');
const CSLEngine = require('./csl-engine');

module.exports = class PreviewController{
    constructor(manager, textEditor){
        this.manager = manager;
        this.editor = textEditor,
        this.engine = new CSLEngine(this.manager.extensionPath);
        this.panel = new PreviewPanel(this);
        //callbacks
        vscode.workspace.onDidCloseTextDocument((textDocument) => {
            if (textDocument === this.editor.document){
                this.panel.view.dispose();
            }
            this.manager.refreshLocaleBar();
        })
        this.panel.view.onDidDispose(()=>{
            this.engine = null;
            this.panel = null;
            this.editor = null;
            this.manager.disposeController(this);
            this.onDidChangeActiveEditor(vscode.window.activeTextEditor);
        })
        vscode.window.onDidChangeActiveTextEditor((textEditor) => {
            this.onDidChangeActiveEditor(textEditor);
        })
    }
    refreshPreview(){
        let style = this.editor.document.getText().toString();
        let bib = this.engine.buildPreviewContent(style);
        this.panel.updateContentHtml(bib);
        this.manager.refreshLocaleBar();
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
        this.manager.refreshLocaleBar();
    }
   onDidChangeActiveWebview(){
        this.manager.refreshLocaleBar();
    }
}
