import * as vscode from 'vscode';
import { l10n } from 'vscode';
import Messages from '../constants/messages';
import Command from './command';
import PreviewService from '../services/preview-service';
import Citable from '../models/citable';
import CitableSupplyingStategyProxy from './preview_citables_supplier/citables-supplying-strategy-proxy';
import Preview from '../models/preview';
import Optional from '../models/optional';

const CITABLE_SOURCE_OPTION_TEXTS = [
  l10n.t(Messages.DEFAULT_DOCUMENTS_CITABLES_SRC),
  l10n.t(Messages.DOI_CITABLES_SRC),
  l10n.t(Messages.SELECT_JSON_CITABLES_SRC)
];

const QUICK_PICK_OPTIONS: vscode.QuickPickOptions = {
  placeHolder: l10n.t(Messages.OPEN_PREVIEW_ASK_CITABLES_SRC)
};

export default class ShowPreviewCommand implements Command<Optional<Preview>> {
  async execute(): Promise<Optional<Preview>> {
    let document = vscode.window.activeTextEditor.document;
    let previewPromise = PreviewService.getPreviewFromDocument(document);
    if (previewPromise.isEmpty())
      return await this.onSelect(await this.showQuickPick());
    else {
        let preview = previewPromise.get()
        preview.focusWebView();
        return Promise.resolve(previewPromise);
    }
  }

  private showQuickPick(): Thenable<string> {
    return vscode.window.showQuickPick(
      CITABLE_SOURCE_OPTION_TEXTS,
      QUICK_PICK_OPTIONS
    );
  }

  private async onSelect(input: string): Promise<Optional<Preview>> {
    if (input != undefined) {
      let citables = await CitableSupplyingStategyProxy
        .getStrategy(input)
        .provideCitables();

        if (citables.length == 0) {
          vscode.window.showInformationMessage(l10n.t(Messages.SKIPPING_PREVIEW_CREATION_NO_CITABLES));
          return Optional.empty();
        }

      return Optional.of(this.initializePreviewWithCitables(citables));
    }
  }

  private initializePreviewWithCitables(citables: Array<Citable>): Preview {
    let preview = PreviewService.createPreview();
    preview.setCitables(citables);
    PreviewService.refreshPreview(preview);
    return preview;
  }
}