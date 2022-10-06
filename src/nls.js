const vscode = require('vscode');
const fs = require('fs');
const path = require('path');

function filterLocales(path){
    let langs = []
    let paths = fs.readdirSync(extensionPath)
        .filter((str)=>{if(str.includes('.nls.')) return true});
    for(let i = 0; i < paths.length; i++){
        if(paths[i].split('.').length == 4){
            langs.push(paths[i].split('.')[2])
        }
    }
    return langs
}

let extensionPath = path.resolve(__dirname, '../');
let langs = filterLocales(extensionPath);

let lang = vscode.env.language;
let nls
if(lang == 'en-us' || !langs.includes(lang)){
    nls = '/package.nls.json';
}else{
    nls = '/package.nls.' + lang + '.json';
}
module.exports = JSON.parse(fs.readFileSync(extensionPath + nls).toString('utf-8'));