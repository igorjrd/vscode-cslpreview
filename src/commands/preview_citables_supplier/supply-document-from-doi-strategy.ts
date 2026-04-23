import vscode from "vscode";
import CitableSupplyingStategy from "./citables-supplying-strategy";
import DoiService from "../../services/doi-service";
import Citable from "../../models/citable";

class SupplyDocumentsFromDOItrategy implements CitableSupplyingStategy {
  async provideCitables(): Promise<Array<Citable>> {
    let value = await vscode.window.showInputBox();

    if (value == null || value == undefined || value.trim() == "")
      return [];
    try {
      return [DoiService.retrieveCitableWithDoi(value)];
    } catch (e) {
      await vscode.window.showErrorMessage(e.message);
      return [];
    }
  }
}

export default SupplyDocumentsFromDOItrategy;