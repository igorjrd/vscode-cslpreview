import vscode, { TextEditor, TextDocument, WebviewPanel } from 'vscode';
import Optional from '../models/optional';
import Preview from "../models/preview";
import WebviewService from './webview-service';
import LocaleBarService from './localebar-service';
import CslService from './csl-service';
import debounce from 'lodash/debounce';

export default class PreviewService {
  private static previews: Array<Preview> = [];

  public static createPreview(): Preview {
    let editor = vscode.window.activeTextEditor;
    let webviewPanel = WebviewService.createWebViewPanel();
    let preview = new Preview(editor, webviewPanel);
    this.previews.push(preview);
    LocaleBarService.refreshLocaleBar();
    return preview;
  }

  public static dismissPreview(preview: Preview): void {
    if (!this.previews.includes(preview))
      throw new Error("Preview not properly dismissed. It was not found in preview registry.");

    let index = this.previews.indexOf(preview);
    this.previews.splice(index, 1);
  }

  public static doesEditorHasPreview(editor: TextEditor): boolean {
    return this.previews.some(preview => preview.getTextEditor() === editor)
  }

  public static doesDocumentHasPreview(document: TextDocument): boolean {
    return this.previews.some(preview => preview.getTextDocument() === document)
  }

  public static getPreviewFromEditor(editor: TextEditor): Optional<Preview> {
    return Optional.ofNullable(this.previews.find(preview => preview.getTextEditor() === editor));
  }

  public static getPreviewFromDocument(document: TextDocument): Optional<Preview> {
    return Optional.ofNullable(this.previews.find(preview => preview.getTextDocument() === document));
  }

  public static getPreviewFromWebview(webview: WebviewPanel): Optional<Preview> {
    return Optional.ofNullable(this.previews.find(preview => preview.getWebviewPanel() == webview));
  }

  public static getPreviewFromActiveWebview(): Optional<Preview> {
    return Optional.ofNullable(this.previews.find(preview => preview.getWebviewPanel().active == true));
  }

  public static getActivePreview(): Optional<Preview> {
    let previewPromise = Optional.empty<Preview>();

    previewPromise = this.getPreviewFromActiveWebview();
    if (previewPromise.isPresent())
      return previewPromise;

    if (vscode.window.activeTextEditor != undefined)
      previewPromise = this.getPreviewFromDocument(vscode.window.activeTextEditor.document);

    return previewPromise;
  }

  public static refreshPreview(preview: Preview): void {
    let webViewHtmlContent = CslService.processPreviewContent(preview);
    preview.getWebView().html = webViewHtmlContent;
    LocaleBarService.refreshLocaleBar();
  }

  public static debouncedRefreshPreview = debounce((preview: Preview) => this.refreshPreview(preview), 250);
}