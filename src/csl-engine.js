const CSL = require('citeproc');
const fs = require('fs');

module.exports = class CSLEngine{
    constructor(extensionPath){
        this.proc = null;
        this.extensionPath = extensionPath;
        this.citeprocSys = new CiteprocSys(this);
        this.citables = null;
        this.citablesIds = null;
    }
    updateCitables(citables){
        this.citables = citables;
        this.citablesIds = Object.keys(this.citables);
    }
    validateStyle(style){
        require('./resources/csl-validator');
        // @ts-ignore
        let errors = validate(style);
        return errors
    }
    buildProcessor(style){
        this.proc = new CSL.Engine(this.citeprocSys, style);
        this.proc.updateItems(this.citablesIds);
    }
    buildPreviewContent(style){
        try{
            this.buildProcessor(style);
            let individualCitations = [];
            for(let i=0; i<this.citablesIds.length; i++){
                let citation= {
                    properties: {
                        noteIndex: (i+1)
                    },
                    citationItems: [{id: this.citablesIds[i]}]
                }
                individualCitations.push(this.proc.appendCitationCluster(citation,[],[])[0][1]);
            }
            let citationItems =[]
            for(let i=0;i<this.citablesIds.length;i++) 
                citationItems.push({id: this.citablesIds[i]});
            let uniqueCitation = this.proc.processCitationCluster({citationItems},[],[]);
            let bibliography = formatBibliographyHtml(this.proc.makeBibliography());
            let previewContent = formatHtmlPreview(individualCitations, uniqueCitation, bibliography);
            return previewContent;
        }catch(e){
            return this.validateStyle(style)
        }
    }
}

class CiteprocSys{
    constructor(engine){
        this.engine = engine;
    }
    retrieveLocale(lang){
        let path = this.engine.extensionPath + '/src/resources/locales/';
        let file = 'locales-' + lang + '.xml';
        return fs.readFileSync(path + file).toString('utf-8');
    }
    retrieveItem(itemId){
        return this.engine.citables[itemId];
    }
}

function formatHtmlPreview(individualCitations, uniqueCitation, bibliography){
    let html = '<h3>Individual citations</h3><hr>';
    html += '<p>' + individualCitations.join('<br>') + '</p>';
    html += '<h3>Unique citation</h3><hr>';
    html += '<p>' + uniqueCitation[1][0][1] + '</p>';
    html += '<h3>Bibliography</h3><hr>';
    html += bibliography;
    return html
}

function formatBibliographyHtml(data){
    /*Strongly based in
    https://github.com/Juris-M/citeproc-js-docs/blob/master/_static/js/citesupport-es6.js
    */
    let bibliographyHtml = data[0].bibstart;
    bibliographyHtml += data[1].join('\n');
    let entries = RegExp('<div class="csl-entry">', 'g');
    let entryStyled = '<div class="csl-entry'
    if (data[0].hangingindent) {
        entryStyled += '" style="margin-left: 1.3em;text-indent: -1.3em;';
        if(data[0].linespacing != 1){
            entryStyled += 'line-height: ' + data[0].linespacing.toString() + ';'
        }
    } else if (data[0]['second-field-align']) {
        var offsetSpec = 'padding-right:0.3em;';
        if (data[0].maxoffset) {
            offsetSpec = 'width: ' + (data[0].maxoffset / 2 + 0.5) + 'em;';
        }
        entryStyled += '" style="white-space: nowrap;';
        if(data[0].linespacing != 1){
            entryStyled += 'line-height: ' + data[0].linespacing.toString() + ';'
        }
        let numbers = RegExp('<div class="csl-left-margin">','g');
        let numberStyled = '<div class="csl-left-margin" style="float:left; display:inline-block;'+offsetSpec+'">';
        bibliographyHtml = bibliographyHtml.replace(numbers, numberStyled);
        if (data[0].maxoffset) {
            var widthSpec = '';
            let texts = RegExp('<div class="csl-right-inline">','g');
            widthSpec = 'width:' + (95) + '%;';
            let textStyled = '<div class="csl-right-inline" style="display: inline-block;white-space: normal;'+widthSpec+'">';
            bibliographyHtml = bibliographyHtml.replace(texts, textStyled);
        }
    }
    if(data[0].entryspacing != 0){
        let spacing = parseInt(data[0].entryspacing);
        if(entryStyled.includes('style=')){
            entryStyled += ' margin-bottom: ' + spacing + 'em;';
        }else{
            entryStyled += '" style="margin-bottom: ' + spacing + 'em;';
        }
    }
    entryStyled += '">'
    bibliographyHtml = bibliographyHtml.replace(entries, entryStyled);
    bibliographyHtml += data[0].bibend;
    return bibliographyHtml
}