import vscode, { Disposable, Event, TextDocumentChangeEvent } from 'vscode';
import BaseListener from "./base-listener";
import Optional from '../models/optional';
import PreviewService from '../services/preview-service';
import Preview from '../models/preview';
import DisposableRegistry from '../services/disposable-registry';

export default class AutoRefreshDocumentChangeListener extends BaseListener<TextDocumentChangeEvent> {
  private static instance: AutoRefreshDocumentChangeListener;

  callback(event: TextDocumentChangeEvent): void {
    if (event.contentChanges.length > 0) {
      let previewPromise: Optional<Preview> = PreviewService.getPreviewFromDocument(event.document);

      if (previewPromise.isEmpty())
        return;

      let preview = previewPromise.get();
      PreviewService.debouncedRefreshPreview(preview);
    }
  }

  dispose(): void {
    DisposableRegistry.dismiss(this.disposable);
    this.disposable.dispose();
    AutoRefreshDocumentChangeListener.instance = undefined;
  }

  static dispose() {
    let instance = AutoRefreshDocumentChangeListener.instance;
    DisposableRegistry.dismiss(instance.disposable);
    instance.disposable.dispose();
    AutoRefreshDocumentChangeListener.instance = undefined;
  }

  private constructor(event: Event<TextDocumentChangeEvent>) {
    super(event);
  }

  static listen(): Disposable {
    if (AutoRefreshDocumentChangeListener.instance == undefined)
      AutoRefreshDocumentChangeListener.instance = new AutoRefreshDocumentChangeListener(
        vscode.workspace.onDidChangeTextDocument
      );

    return AutoRefreshDocumentChangeListener.instance.disposable;
  }
}