import DocumentContextRegistry from "../context-registry";
import ZoteroServerCommandHandler from "../zotero-server-command-handler";

export default class GetDocumentDataHandler implements ZoteroServerCommandHandler {
    shouldHandle(command: string): boolean {
        return command == 'Document_getDocumentData';
    }

    handle(args: [id: number]): string {
        let context = DocumentContextRegistry.getDocumentById(args[0]);
        return `"${context.getDocumentData()}"`;
    }
}