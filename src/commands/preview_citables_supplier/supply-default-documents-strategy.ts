import vscode, { l10n, Uri } from "vscode";
import CitableSupplyingStategy from "./citables-supplying-strategy";
import { loadCitablesFromJsonFile } from '../../utils/io-utils';
import Citable from "../../models/citable";
import ContextService from "../../services/context-service";
import ConfigurationService from "../../services/configuration-service";
import Messages from "../../constants/messages";

class SupplyDefaultDocumentsStrategy implements CitableSupplyingStategy {
  async provideCitables(): Promise<Array<Citable>> {
    let path = ConfigurationService.getCitablesJsonFilePath();

    if (path != "") {
      try {
        let input = vscode.Uri.file(path);
        let citables = this.readCitablesFromJson(input);
        return citables;
      } catch (e) {
        vscode.window.showInformationMessage(l10n.t(Messages.INVALID_CITABLES_SRC_FILE_MESSAGE));
        let citables = this.provideExampleCitables();
        return citables;
      }
    } else {
      let citables = this.provideExampleCitables();
      return citables;
    }
  }

  provideExampleCitables(): Array<Citable> {
    let path = `${ContextService.getExtensionPath()}/resources/example_items.json`;
    return loadCitablesFromJsonFile(path);
  }

  readCitablesFromJson(input: Uri): Array<Citable> {
    let path = input.path.slice(1)
    return loadCitablesFromJsonFile(path);
  }
}

export default SupplyDefaultDocumentsStrategy;