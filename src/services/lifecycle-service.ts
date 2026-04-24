import AutoRefreshSettingChangeListener from "../events/auto-refresh-setting-change-listener";
import ConfigurationService from "./configuration-service";
import AutoRefreshDocumentChangeListener from "../events/auto-refresh-document-change-listener";
import DisposableRegistry from "./disposable-registry";
import ActiveTextEditorChangeListener from "../events/active-text-editor-change-listener";
import TextDocumentCloseListener from "../events/text-document-close-listener";

export default class LifecycleService {
  static startup(): void {
    ActiveTextEditorChangeListener.listen();
    TextDocumentCloseListener.listen();
    AutoRefreshSettingChangeListener.listen();
    if (ConfigurationService.isAutoRefreshEnabled())
      AutoRefreshDocumentChangeListener.listen();
  }

  static finish(): void {
    DisposableRegistry.disposeAll();
  }
}