import * as vscode from 'vscode';
import Command from "./command";
import PreviewService from '../services/preview-service';

export default class ShowSourceCommand implements Command<vscode.TextDocument> {
  async execute(): Promise<vscode.TextDocument> {
    let previewPromise = PreviewService.getPreviewFromActiveWebview();

    if (previewPromise.isEmpty())
      return;

    let preview = previewPromise.get();

    vscode.window.showTextDocument(
      preview.getTextDocument(),
      preview.getTextEditor().viewColumn
    );

    return preview.getTextDocument();
  }
}