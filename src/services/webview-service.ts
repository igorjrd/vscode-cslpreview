import vscode from "vscode";
import WebviewViewStateChangeListener from "../events/webview-view-state-change-listener";
import WebviewDisposeListener from "../events/webview-dispose-listener";
import ContextService from "./context-service";

export default class WebviewService {
  static createWebViewPanel(): vscode.WebviewPanel {
    let viewName = this.getViewName();
    let column = vscode.window.activeTextEditor.viewColumn + 1;
    let webview = vscode.window.createWebviewPanel(
      'CSLPreview',
      viewName,
      column
    )

    ContextService.setIsPreviewActiveContext(webview.active);

    let listenerDisposable = WebviewViewStateChangeListener.listen(webview.onDidChangeViewState);
    WebviewDisposeListener.listen(webview.onDidDispose, webview, [listenerDisposable]);

    return webview;
  }

  private static getViewName(): string {
    let nameParts = vscode.window.activeTextEditor.document.fileName.split('/');
    return `CSL Preview: ${nameParts[nameParts.length - 1]}`;
  }
}