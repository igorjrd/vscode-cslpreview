import { l10n } from "vscode";
import CitableSupplyingStategy from "./citables-supplying-strategy";
import Messages from "../../constants/messages";
import SupplyDefaultDocumentsStrategy from "./supply-default-documents-strategy";
import SupplyDocumentsFromJSONStrategy from "./supply-documents-from-json-strategy";
import SupplyDocumentsFromDOItrategy from "./supply-document-from-doi-strategy";

const CITABLE_SUPPLYING_STRATEGIES: Map<String, () => CitableSupplyingStategy> = new Map();
CITABLE_SUPPLYING_STRATEGIES.set(l10n.t(Messages.DEFAULT_DOCUMENTS_CITABLES_SRC), () => new SupplyDefaultDocumentsStrategy);
CITABLE_SUPPLYING_STRATEGIES.set(l10n.t(Messages.SELECT_JSON_CITABLES_SRC), () => new SupplyDocumentsFromJSONStrategy);
CITABLE_SUPPLYING_STRATEGIES.set(l10n.t(Messages.DOI_CITABLES_SRC), () => new SupplyDocumentsFromDOItrategy)


export default class CitableSupplyingStategyProxy {
  static getStrategy(key: string): CitableSupplyingStategy {
    let supplier = CITABLE_SUPPLYING_STRATEGIES.get(key);
    return supplier.apply(null);
  }
}