import { Disposable, Event, WebviewPanel } from "vscode";
import BaseListener from "./base-listener";
import PreviewService from "../services/preview-service";
import DisposableRegistry from "../services/disposable-registry";
import LocaleBarService from "../services/localebar-service";
import ContextService from "../services/context-service";

export default class WebviewDisposeListener extends BaseListener<void> {
  private readonly webview: WebviewPanel;
  private disposables: Array<Disposable>;

  callback(): void { }

  private constructor(event: Event<void>, webview: WebviewPanel, disposables: Array<Disposable>) {
    super(event);
    this.webview = webview;
    this.disposables = disposables;

    DisposableRegistry.dispose(this.disposable);
    this.disposable = event(() => this.callbackWithWebView());
  }

  callbackWithWebView(): void {
    let previewPromise = PreviewService.getPreviewFromWebview(this.webview);
    if (previewPromise.isPresent())
      PreviewService.dismissPreview(previewPromise.get());
    this.disposables
      .forEach(disposable => disposable.dispose());
    this.disposables
      .forEach(disposable => DisposableRegistry.dismiss(disposable));
    LocaleBarService.refreshLocaleBar();
    ContextService.setIsActiveSourceContext(false);
  }

  static listen(event: Event<void>, webview: WebviewPanel, disposables: Array<Disposable>): Disposable {
    let instance = new WebviewDisposeListener(event, webview, disposables);
    return instance.disposable;
  }
}