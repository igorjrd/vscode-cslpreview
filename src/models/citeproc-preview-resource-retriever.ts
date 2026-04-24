import { readFileSync } from "fs";
import type { CiteProcSys } from "citeproc";
import type Preview from "./preview";
import ContextService from "../services/context-service";
import Citable from "./citable";

export default class CiteProcPreviewResourceRetriever implements CiteProcSys {
  readonly localesDirPath: string;
  readonly preview: Preview;

  constructor(preview: Preview) {
    let extensionContext = ContextService.getExtensionContext();
    this.localesDirPath = `${extensionContext.extensionPath}/resources/locales`;
    this.preview = preview;
  }

  retrieveLocale(lang: string): string {
    this.preview.setCurrentLang(lang);
    let localeFilePath = `${this.localesDirPath}/locales-${lang}.xml`;
    return readFileSync(localeFilePath).toString('utf-8');
  }

  retrieveItem(itemId: string): Citable {
    let findings = this.preview.getCitables()
      .filter(citable => citable.id == itemId);
    return findings.length > 0 ? findings[0] : null;
  }
}