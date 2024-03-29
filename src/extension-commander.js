const vscode = require('vscode');
const utils = require('./utils');
const locales = require('./resources/locales/locales.json');
const dict = require('./nls')

const conf = () => {
    return vscode.workspace.getConfiguration('cslPreview');
}

module.exports = class ExtensionCommander{
    constructor(manager){
        this.manager = manager;
    }
    showCslPreview(){
        let editor = vscode.window.activeTextEditor;
        if(!this.manager.doesDocumentHasPreview(editor.document)){
            let text = dict['askCitablesSourceText']
            let options = Object.values(dict.citablesSrcOpts);
            let pick = vscode.window.showQuickPick(options,{placeHolder: text});
            pick.then(input => {
                if(input != undefined){
                    if (input == dict.citablesSrcOpts.stdDocs){
                        let path = conf().get('defaultCitablesFilePath');
                        if(path != ""){
                            try{
                                let input = vscode.Uri.file(path);
                                this.openCslPreviewFromJson(input);
                            }catch(e){
                                vscode.window.showInformationMessage(dict.invalidDocsJsonMsg);
                                this.openCslPreviewFromJson();
                            }
                        }else{
                            this.openCslPreviewFromJson();
                        }
                    }else if(input == dict.citablesSrcOpts.selCslJson){
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
                            this.openCslPreviewFromJson(input[0]);
                        })
                    }else if(input == dict.citablesSrcOpts.doi){
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
            path = input.path.slice(1)
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
    chooseLocale(){
        let active_controler = this.manager.getActiveController();
        let codes = Object.keys(locales['language-names']);
        let text = dict['localeSelectDialog'];
        let pick = vscode.window.showQuickPick(codes, {placeHolder:text});
        pick.then(input =>{
            if (input != undefined){
                active_controler.engine.forcedLang = input;
                active_controler.refreshPreview();
            }
        })
    }
}
