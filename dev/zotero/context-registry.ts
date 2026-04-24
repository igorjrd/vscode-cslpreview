import DocumentContext from "./models/document-context";
import DocumentField from "./models/document-field";

export default class DocumentContextRegistry {
    private static readonly idContextMap = new Map<number,DocumentContext>();

    static isEmpty(): boolean {
        return this.idContextMap.size == 0;
    }

    static register(id:number, context: DocumentContext) {
        this.idContextMap.set(id, context);
    }

    static getDocumentById(id: number): DocumentContext {
        return this.idContextMap.get(id);
    }

    static getFieldByDocumentId(id: number): DocumentField {
        return this.getDocumentById(id).getField();
    }
}