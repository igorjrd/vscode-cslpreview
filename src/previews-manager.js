const PreviewController = require('./preview-controller');
const vscode = require('vscode');
const locales = require('./resources/locales/locales.json');
const dict = require('./nls');

module.exports = class PreviewManager{
    constructor(extensionPath, localeBar){
        this.extensionPath = extensionPath;
        this.controllers = [];
        this.localeBar = localeBar;
    }
    createController(citables){
        let editor = vscode.window.activeTextEditor;
        let _controller = new PreviewController(this, editor);
        let lang = vscode.workspace.getConfiguration('cslPreview').get('defaultLocale');
        if(lang != ''){
            if(lang in locales['language-names']){
                _controller.engine.forcedLang = lang;
            }else{
                vscode.window.showInformationMessage(dict.invalidConfLocaleMsg);
            }
        }
        _controller.engine.updateCitables(citables);
        _controller.refreshPreview();
        this.controllers.push(_controller);
        this.refreshLocaleBar();
    }   
    disposeController(_controller){
        let index = this.controllers.indexOf(_controller);
        this.controllers.splice(index,1);
    }
    doesDocumentHasPreview(document){
        return this.controllers.some(controller => controller.editor.document === document)
    }
    getControllerFromDocument(document){
        return this.controllers.find(controller => controller.editor.document === document)
    }
    getControllerFromActiveWebview(){
        return this.controllers.find(controller => controller.panel.view.active == true)
    }
    getActiveController(){
        let doc = undefined
        if (vscode.window.activeTextEditor != undefined){
            doc = this.getControllerFromDocument(vscode.window.activeTextEditor.document);
        }
        let view = this.getControllerFromActiveWebview();
        if (view != undefined){
            return view     
        }else if(doc != undefined){
            return doc
        }else{
            return undefined
        }
    }
    refreshLocaleBar(){
        let active_controller = this.getActiveController();
        if(active_controller != undefined){
            this.localeBar.bar.text = "$(ports-open-browser-icon) " + active_controller.engine.lang;
            this.localeBar.bar.show();
        }else{
            this.localeBar.bar.hide();
        }
    }
}
