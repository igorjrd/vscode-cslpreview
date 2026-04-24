import { ConfigurationChangeEvent, Disposable, Event, workspace } from "vscode";
import ConfigurationService from "../services/configuration-service";
import BaseListener from "./base-listener";
import AutoRefreshDocumentChangeListener from "./auto-refresh-document-change-listener";

export default class AutoRefreshSettingChangeListener extends BaseListener<ConfigurationChangeEvent> {
  private documentChangeListenerDisposable: Disposable;

  callback(event: ConfigurationChangeEvent): void {
    if (event.affectsConfiguration("cslPreview.autoRefreshPreview")) {
      if (ConfigurationService.isAutoRefreshEnabled())
        this.documentChangeListenerDisposable = AutoRefreshDocumentChangeListener.listen();
      else
        this.documentChangeListenerDisposable.dispose();
    }
  }

  private constructor(event: Event<ConfigurationChangeEvent>) {
    super(event);
  }

  static listen(): Disposable {
    let instance = new AutoRefreshSettingChangeListener(workspace.onDidChangeConfiguration);
    return instance.disposable;
  }
}