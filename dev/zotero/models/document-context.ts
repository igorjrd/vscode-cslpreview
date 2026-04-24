import DocumentField from "./document-field";

export default class DocumentContext {
    private id: number;
    private documentData: string = '';
    private field: DocumentField;

    constructor(id: number) {
        this.id = id;
    }

    setDocumentData(value: string): void {
        this.documentData = value;
    }

    getDocumentData(): string {
        // return `<data data-version="3" zotero-version="6.0.35"><session id="EOwmyI1M"/><style id="http://www.zotero.org/styles/ieee" locale="pt-BR" hasBibliography="1" bibliographyStyleHasBeenSet="0"/><prefs><pref name="fieldType" value="ReferenceMark"/></prefs></data>`
        return '<data data-version=\\"3\\" zotero-version=\\"6.0.35\\"><session id=\\"EOwmyI1M\\"/><style id=\\"http://www.zotero.org/styles/ieee\\" locale=\\"pt-BR\\" hasBibliography=\\"1\\" bibliographyStyleHasBeenSet=\\"0\\"/><prefs><pref name=\\"fieldType\\" value=\\"ReferenceMark\\"/></prefs></data>'
        // return this.documentData;
    }

    insertField(field: DocumentField): void {
        this.field = field;
    }

    getField(): DocumentField {
        return this.field;
    }
}