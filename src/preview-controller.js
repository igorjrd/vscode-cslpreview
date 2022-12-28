const vscode= require('vscode');
const PreviewPanel = require('./preview-panel');
const CSLEngine = require('./csl-engine');

module.exports = class PreviewController{
    constructor(manager, textEditor){
        this.manager = manager;
        this.editor = textEditor,
        this.engine = new CSLEngine(this.manager.extensionPath);
        this.panel = new PreviewPanel(this);
        this.refreshQueue = new RefreshQueue(this);
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
            vscode.commands.executeCommand('setContext', 'CSLPreviewActive', false);
        })
        vscode.window.onDidChangeActiveTextEditor((textEditor) => {
            this.onDidChangeActiveEditor(textEditor);
        })
    }
    refreshPreview(){
        this.refreshQueue.readyToRefresh = false;
        let style = this.editor.document.getText().toString();
        let bib = this.engine.buildPreviewContent(style);
        this.panel.updateContentHtml(bib);
        this.manager.refreshLocaleBar();
        this.refreshQueue.lastRefresh = Date.now();
        this.refreshQueue.readyToRefresh = true;
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

class RefreshQueue{
    constructor(controller){
        this.queue = [];
        this.controller = controller
        this.lastRequest = 0;
        this.lastRefresh = 0;
        this.readyToRefresh = true;
        this.delay = 500;
        this.alreadyScheduled = false;
    }
    requestRefresh(){
        this.lastRequest = Date.now();
        if(this.queue.length < 2){
            this.queue.unshift(this.lastRequest);
        } else {
            this.queue.splice(0,1);
            this.queue.unshift(this.lastRequest);
        }
        if(this.queue.length > 0 && !this.alreadyScheduled){
            this.alreadyScheduled = true;
            this.scheduleRefresh(this.delay - (this.queue.slice(-1) - this.lastRefresh));
        }
    }
    scheduleRefresh(timeout){
        setTimeout(() => {
            if(this.readyToRefresh){
                this.controller.refreshPreview();
                this.queue.pop();
                this.alreadyScheduled = false;
            } else {
                this.scheduleRefresh(this.delay);
            }
        }, timeout);
    }
}