import { CiteProcSys } from 'citeproc';
import { TextEditor, TextDocument, WebviewPanel, Webview } from 'vscode';
import CiteProcPreviewResourceRetriever from './citeproc-preview-resource-retriever';
import Citable from './citable';

export default class Preview {
  private readonly textEditor: TextEditor;
  private readonly webviewPanel: WebviewPanel;
  private citables: Array<Citable> = [];
  private currentLang?: string;
  private forcedLang?: string;
  private readonly citeprocResourceRetriever: CiteProcSys;

  constructor(textEditor: TextEditor, webviewPanel: WebviewPanel) {
    this.textEditor = textEditor;
    this.webviewPanel = webviewPanel;
    this.citeprocResourceRetriever = new CiteProcPreviewResourceRetriever(this);
  }

  public getWebviewPanel(): WebviewPanel {
    return this.webviewPanel;
  }

  public getWebView(): Webview {
    return this.webviewPanel.webview;
  }

  public focusWebView(): void {
    this.webviewPanel.reveal();
  }

  public getTextEditor(): TextEditor {
    return this.textEditor;
  }

  public getTextDocument(): TextDocument {
    return this.textEditor.document;
  }

  public setCitables(citables: Array<Citable>): void {
    this.citables = citables;
  }

  public getCitables(): Array<Citable> {
    return this.citables;
  }

  public getCitableIds() {
    return Object.keys(this.citables);
  }

  public setCurrentLang(lang: string): void {
    this.currentLang = lang;
  }

  public getCurrentLang(): String {
    return this.currentLang;
  }

  public setForcedLang(lang: string): void {
    this.forcedLang = lang;
  }

  public getForcedLang(): string {
    return this.forcedLang;
  }

  public getCiteProcResourceRetriever(): CiteProcSys {
    return this.citeprocResourceRetriever;
  }
}