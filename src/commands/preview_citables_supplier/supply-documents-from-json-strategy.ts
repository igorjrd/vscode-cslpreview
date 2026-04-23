import vscode, { l10n, Uri } from "vscode";
import CitableSupplyingStategy from "./citables-supplying-strategy";
import { loadCitablesFromJsonFile } from '../../utils/io-utils';
import Citable from "../../models/citable";

class SupplyDocumentsFromJSONStrategy implements CitableSupplyingStategy {
  async provideCitables(): Promise<Array<Citable>> {
    let input = await vscode.window.showOpenDialog({
      canSelectFiles: true,
      canSelectFolders: false,
      canSelectMany: false,
      filters: {
        "CSL JSON": ['json']
      },
      openLabel: l10n.t('Open'),
      title: l10n.t("Select CSL JSON file")
    });

    if (input == undefined || input.length == 0)
      return [];

    return this.readCitablesFromJsonFile(input[0]);
  }

  readCitablesFromJsonFile(input: Uri): Array<Citable> {
    let path = input.fsPath;
    return loadCitablesFromJsonFile(path);
  }
}

export default SupplyDocumentsFromJSONStrategy;