const vscode = require('vscode');
const utils = require('./utils');

module.exports = class ExtensionCommander{
    constructor(manager){
        this.manager = manager;
    }
    showCslPreview(){
        let editor = vscode.window.activeTextEditor;
        if(!this.manager.doesDocumentHasPreview(editor.document)){
            let text = 'Open CSL citations and bibliography preview using citables from: '
            let options = ['Standard documents', 'DOI'];
            let pick = vscode.window.showQuickPick(options,{placeHolder: text});
            pick.then(input => {
                if(input != undefined){
                    if (input == 'Standard documents'){
                        this.openCslPreviewFromJson();
                    }else if(input == 'DOI'){
                        this.openCslPreviewFromIdentifier();
                    }
                }
            })
        }else{
            let controller = this.manager.getControllerFromDocument(editor.document);
            controller.panel.view.reveal();
        }
    }
    openCslPreviewFromJson(){
        let path = '/src/resources/example_items.json';
        let citables = utils.getCitablesFromJson(this.manager.extensionPath, path);
        this.manager.createController(citables);
    }
    openCslPreviewFromIdentifier(){
        vscode.window.showInputBox().then(value=>{
            try{
                let citables = utils.getCitablesFromIdentifier(value);
                this.manager.createController(citables);
            } catch(e){
                vscode.window.showErrorMessage(e.message);
            }
        })
    }
    showSource(){
        let controller = this.manager.getControllerFromActiveWebview();
        vscode.window.showTextDocument(controller.editor.document,
            controller.editor.viewColumn);
    }
    refreshPreview(){
        let activeTextEditor = vscode.window.activeTextEditor;
        let controller;
        if(activeTextEditor != undefined){
            controller = this.manager.getControllerFromDocument(activeTextEditor.document);
        }else{
            controller = this.manager.getControllerFromActiveWebview();
        }
        controller.refreshPreview();
    }
}
