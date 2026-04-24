import { window, Disposable, Event, TextEditor } from "vscode";
import BaseListener from "./base-listener";
import PreviewService from "../services/preview-service";
import ContextService from "../services/context-service";
import LocaleBarService from "../services/localebar-service";

export default class ActiveTextEditorChangeListener extends BaseListener<TextEditor> {
  callback(editor: TextEditor): void {
    let previewPromise = PreviewService.getPreviewFromEditor(editor);
    ContextService.setIsActiveSourceContext(previewPromise.isPresent());
    LocaleBarService.refreshLocaleBar();
  }

  private constructor(event: Event<TextEditor>) {
    super(event);
  }

  static listen(): Disposable {
    let instance = new ActiveTextEditorChangeListener(window.onDidChangeActiveTextEditor);
    return instance.disposable;
  }
}