const CSL = require('citeproc')

module.exports = class CSLProcessor extends CSL.Engine{
    constructor(sys, style, lang, forcelang){
        super(sys, style, lang, forcelang);
    }
    updateStyle(style){
        this.cslXml = CSL.setupXml(style);
        this.cslXml.addMissingNameNodes(this.cslXml.dataObj);
        this.cslXml.addInstitutionNodes(this.cslXml.dataObj);
        this.cslXml.insertPublisherAndPlace(this.cslXml.dataObj);
        this.cslXml.flagDateMacros(this.cslXml.dataObj);
        let attrs = this.cslXml.attributes(this.cslXml.dataObj);
        if ("undefined" === typeof attrs["@sort-separator"]) {
            this.cslXml.setAttribute(this.cslXml.dataObj, "sort-separator", ", ");
        }

        this.setStyleAttributes();

        this.opt.xclass = this.cslXml.getAttributeValue(this.cslXml.dataObj, "class");
        this.opt["class"] = this.opt.xclass;
        this.opt.styleID = this.cslXml.getStyleId(this.cslXml.dataObj);
        this.opt.styleName = this.cslXml.getStyleId(this.cslXml.dataObj, true);
        
        this.build.area = "citation";
        var area_nodes = this.cslXml.getNodesByName(this.cslXml.dataObj, this.build.area);
        this.buildTokenLists(area_nodes, this[this.build.area].tokens);
    
        this.build.area = "bibliography";
        var area_nodes = this.cslXml.getNodesByName(this.cslXml.dataObj, this.build.area);
        this.buildTokenLists(area_nodes, this[this.build.area].tokens);
    
        this.build.area = "intext";
        var area_nodes = this.cslXml.getNodesByName(this.cslXml.dataObj, this.build.area);
        this.buildTokenLists(area_nodes, this[this.build.area].tokens);
    }
}