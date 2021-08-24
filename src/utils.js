const fs = require("fs");
const path = require("path");
const Ajv = require("ajv");
const fetch = require("sync-fetch");

function getCitablesFromIdentifier(identifier) {
  const url = "http://api.crossref.org/works/";

  try {
    const response = fetch(url + identifier).json();

    let cslJson = crossref2CslJson(response);
    let citables = {};
    citables[cslJson[0]["id"]] = cslJson[0];
    return citables;
  } catch (e) {
    console.error("get doi error:", e);
    throw Error("Resource not found!");
  }
}

function getCitablesFromJson(jsonPath) {
  console.log("-- getCitables jsonPath:", jsonPath);

  try {
    let str = fs.readFileSync(jsonPath).toString("utf-8");
    let jsonCitables = JSON.parse(str);
    let citables = {};
    for (let i = 0; i < jsonCitables.length; i++) {
      citables[jsonCitables[i]["id"]] = jsonCitables[i];
    }
    return citables;
  } catch (e) {
    console.error("--getCitablesFromJson error:", e);
    throw e;
  }
}

function crossref2CslJson(crossrefOut) {
  let ajv = new Ajv({
    validateSchema: false,
    allErrors: true,
    removeAdditional: true,
  });
  // @ts-ignore
  let item = [crossrefOut.message];
  let id = item[0].DOI;
  let type = item[0].type;
  let title = item[0].title[0];
  let container = item[0]["container-title"][0];
  let ISSN = item[0].ISSN[0];
  if (type == "journal-article") {
    item[0].type = "article-journal";
  }
  item[0].id = id;
  item[0].title = title;
  item[0]["container-title"] = container;
  item[0].ISSN = ISSN;
  delete item[0]["original-title"];
  //ajv validation is currently removing additional fields (considering csl-json schema)
  validateItem(item);
  return item;
}

let ajv = new Ajv({
  validateSchema: false,
  allErrors: true,
  removeAdditional: true,
});
let validateItem = ajv.compile(require("./resources/csl-data.json"));

module.exports = {
  getCitablesFromIdentifier,
  getCitablesFromJson,
};
