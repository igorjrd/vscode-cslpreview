import vscode, { l10n } from 'vscode';
import PreviewService from "./preview-service";
import CommandKeys from '../constants/command-keys';
import Messages from '../constants/messages';

const STATUS_BAR_PRIORITY = 10000;

export default class LocaleBarService {
  private static localeBar: vscode.StatusBarItem;

  public static createLocaleBar(): vscode.StatusBarItem {
    this.localeBar = vscode.window.createStatusBarItem(
      vscode.StatusBarAlignment.Right,
      STATUS_BAR_PRIORITY
    );
    this.localeBar.command = CommandKeys.CHOOSE_LOCALE;
    this.localeBar.tooltip = l10n.t(Messages.LOCALE_BAR_TOOLTIP);
    return this.localeBar;
  }

  public static refreshLocaleBar() {
    let activePreviewPromise = PreviewService.getActivePreview();

    if (activePreviewPromise.isPresent()) {
      let preview = activePreviewPromise.get();
      this.localeBar.text = `$(ports-open-browser-icon) ${preview.getCurrentLang()}`;
      this.localeBar.show();
    } else
      this.localeBar.hide();
  }
}