import vscode from 'vscode';
import ConfigurationKeys from '../constants/configuration-keys';

export default class ConfigurationService {
  static worskpaceConfig: vscode.WorkspaceConfiguration;

  static {
    this.worskpaceConfig = vscode.workspace.getConfiguration("cslPreview");
  }

  static isAutoRefreshEnabled(): boolean {
    return this.worskpaceConfig.get<boolean>(ConfigurationKeys.AUTO_REFRESH_ENABLED);
  }

  static getDefaultLocale(): string {
    return this.worskpaceConfig.get<string>(ConfigurationKeys.DEFAULT_LOCALE);
  }

  static getCitablesJsonFilePath(): string {
    return this.worskpaceConfig.get<string>(ConfigurationKeys.CITABLES_JSON_FILE_PATH);
  }
}