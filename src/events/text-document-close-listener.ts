import { workspace, Disposable, Event, TextDocument } from "vscode";
import BaseListener from "./base-listener";
import PreviewService from "../services/preview-service";

export default class TextDocumentCloseListener extends BaseListener<TextDocument> {
  callback(document: TextDocument): void {
    let previewPromise = PreviewService.getPreviewFromDocument(document);
    if (previewPromise.isPresent()) {
      PreviewService.dismissPreview(previewPromise.get());
      previewPromise.get().getWebviewPanel().dispose();
    }
  }

  private constructor(event: Event<TextDocument>) {
    super(event);
  }

  static listen(): Disposable {
    let instance = new TextDocumentCloseListener(workspace.onDidCloseTextDocument);
    return instance.disposable;
  }
}