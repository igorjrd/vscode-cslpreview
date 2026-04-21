import * as vscode from 'vscode';
import { l10n } from 'vscode';
import locales from '../../resources/locales/locales.json';
import Command from "./command";
import PreviewService from '../services/preview-service';
import Messages from '../constants/messages';
import type Preview from '../models/preview';

export default class ChooseLocaleCommand implements Command<string> {
  async execute(): Promise<string> {
    let previewPromise = PreviewService.getActivePreview();
    let codes = Object.keys(locales['language-names']);
    let text = l10n.t(Messages.ASK_FOR_RFC_5646_TAG);

    if (previewPromise.isEmpty())
      return;

    return this.onSelectedLang(
      previewPromise.get(),
      await vscode.window.showQuickPick(codes, { placeHolder: text })
    );
  }

  private onSelectedLang(preview: Preview, lang: string) {
    if (lang != undefined) {
      preview.setForcedLang(lang);
      PreviewService.refreshPreview(preview);
      return lang;
    }
  }
}