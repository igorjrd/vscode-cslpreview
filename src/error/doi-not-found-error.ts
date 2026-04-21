import * as vscode from "vscode";
import Messages from "../constants/messages";

export default class DoiNotFoundError extends Error {
  constructor() {
    vscode.window.showErrorMessage(vscode.l10n.t(Messages.DOI_NOT_FOUND));
    super(Messages.DOI_NOT_FOUND);
  }
}