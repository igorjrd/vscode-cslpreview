import { Disposable, Event, WebviewPanelOnDidChangeViewStateEvent } from "vscode";
import BaseListener from "./base-listener";
import LocaleBarService from "../services/localebar-service";
import ContextService from "../services/context-service";

export default class WebviewViewStateChangeListener extends BaseListener<WebviewPanelOnDidChangeViewStateEvent> {
  callback(event: WebviewPanelOnDidChangeViewStateEvent): void {
    ContextService.setIsPreviewActiveContext(event.webviewPanel.active);
    LocaleBarService.refreshLocaleBar();
  }

  private constructor(event: Event<WebviewPanelOnDidChangeViewStateEvent>) {
    super(event);
  }

  static listen(event: Event<WebviewPanelOnDidChangeViewStateEvent>): Disposable {
    let instance = new WebviewViewStateChangeListener(event);
    return instance.disposable;
  }
}