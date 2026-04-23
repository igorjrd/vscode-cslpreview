import { readFileSync } from "fs";
import Citable from "../models/citable";

function validateCitable(citable: Citable): boolean {
  return citable.title != undefined && citable.type != undefined;
}

export function loadCitablesFromJsonFile(jsonFilePath: string): Array<Citable> {
  let fileContent = readFileSync(jsonFilePath);
  let citables = JSON.parse(fileContent.toString('utf-8')) as Array<Citable>;
  return citables.filter(validateCitable);
}