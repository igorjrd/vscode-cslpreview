const XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;
const fs = require('fs');
const Ajv = require('ajv');

function getCitablesFromIdentifier(identifier){
    let url = 'http://api.crossref.org/works/';
    let xhr = new XMLHttpRequest();
    // @ts-ignore
    xhr.open('GET', url+identifier, false);
    xhr.send(null);
    let response = xhr.responseText;
    if(response != 'Resource not found.'){
        let crossrefJson = JSON.parse(xhr.responseText);
        let cslJson = crossref2CslJson(crossrefJson);
        let citables = {};
        citables[cslJson[0]['id']] = cslJson[0];
        return citables
    }
    else{
        throw Error('Resource not found!');
    }
}

function getCitablesFromJson(jsonPath){
    let str = fs.readFileSync(jsonPath).toString('utf-8');
    let jsonCitables = JSON.parse(str);
    let citables = {};
    for(let i=0; i < jsonCitables.length; i++){
        citables[jsonCitables[i]['id']] = jsonCitables[i];
    }
    return citables
}

function crossref2CslJson(crossrefOut){
    let ajv = new Ajv({validateSchema: false,allErrors: true, removeAdditional: true});
    // @ts-ignore
    let item = [crossrefOut.message];
    let id = item[0].DOI;
    let type = item[0].type;
    let title = item[0].title[0];
    let container = item[0]['container-title'][0];
    let ISSN = item[0].ISSN[0];
    if(type == 'journal-article'){
        item[0].type = 'article-journal';
    }
    item[0].id = id;
    item[0].title = title;
    item[0]['container-title'] = container;
    item[0].ISSN = ISSN;
    delete item[0]['original-title'];
    //ajv validation is currently removing additional fields (considering csl-json schema)
    validateItem(item);
    return item
}

let ajv = new Ajv({validateSchema: false,allErrors: true, removeAdditional: true});
let validateItem = ajv.compile(require('./resources/csl-data.json'));

module.exports = {
    getCitablesFromIdentifier,
    getCitablesFromJson
}