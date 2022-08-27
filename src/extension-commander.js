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
            let options = ['Standard documents', 'DOI', 'Select CSL JSON file'];
            let pick = vscode.window.showQuickPick(options,{placeHolder: text});
            pick.then(input => {
                if(input != undefined){
                    if (input == 'Standard documents'){
                        this.openCslPreviewFromJson(null);
                    }else if('Select CSL JSON file'){
                        let path = vscode.window.showOpenDialog({
                            canSelectFiles: true,
                            canSelectFolders: false,
                            canSelectMany: false,
                            filters: {"CSL JSON": ['json']
                        },
                            openLabel: 'Open',
                            title: "Select CSL JSON file"
                        })
                        path.then(input =>{
                            this.openCslPreviewFromJson(input);
                        })
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
    openCslPreviewFromJson(input){
        let path = '';
        let citables = null;
        if(input == null){
            path = this.manager.extensionPath + '/src/resources/example_items.json';
            citables = utils.getCitablesFromJson(path);
        }else{
            path = input[0].path.slice(1)
            citables = utils.getCitablesFromJson(path);     
        }
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
