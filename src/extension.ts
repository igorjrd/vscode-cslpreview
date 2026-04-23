import * as vscode from 'vscode';
import CommandKeys from './constants/command-keys';
import CommandService from './services/command-service';
import LocaleBarService from './services/localebar-service';
import ContextService from './services/context-service';
import LifecycleService from './services/lifecycle-service';

function activate(context: vscode.ExtensionContext) {
  ContextService.setExtensionContext(context);
  LifecycleService.startup();

  LocaleBarService.createLocaleBar();
  const commandService = new CommandService();

  const register = vscode.commands.registerCommand;
  context.subscriptions.push(
    register(CommandKeys.SHOW_PREVIEW, () => commandService.executeShowPreview()),
    register(CommandKeys.REFRESH_PREVIEW, () => commandService.executeRefreshPreview()),
    register(CommandKeys.SHOW_SOURCE, () => commandService.executeShowSource()),
    register(CommandKeys.CHOOSE_LOCALE, () => commandService.executeChooseLocale()),
  );
}

exports.activate = activate;

function deactivate() {
  LifecycleService.finish();
}

module.exports = {
  activate,
  deactivate
}