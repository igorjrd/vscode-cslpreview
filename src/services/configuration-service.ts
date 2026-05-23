import vscode from 'vscode';
import ConfigurationKeys from '../constants/configuration-keys';

export default class ConfigurationService {
  private static get config(): vscode.WorkspaceConfiguration {
    return vscode.workspace.getConfiguration("cslPreview");
  }

  static isAutoRefreshEnabled(): boolean {
    return this.config.get<boolean>(ConfigurationKeys.AUTO_REFRESH_ENABLED);
  }

  static getDefaultLocale(): string {
    return this.config.get<string>(ConfigurationKeys.DEFAULT_LOCALE);
  }

  static getCitablesJsonFilePath(): string {
    return this.config.get<string>(ConfigurationKeys.CITABLES_JSON_FILE_PATH);
  }
}