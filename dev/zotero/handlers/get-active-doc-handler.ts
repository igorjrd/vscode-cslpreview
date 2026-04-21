import DocumentContext from "../models/document-context";
import DocumentContextRegistry from "../context-registry";
import ZoteroServerCommandHandler from "../zotero-server-command-handler";

export default class GetActiveDocumentHandler implements ZoteroServerCommandHandler {
    shouldHandle(command: string): boolean {
        return command == 'Application_getActiveDocument';
    }

    handle(args: [protocolVersion: number]): string {
        let protocolVersion = args[0];
        let id = 1
        if (DocumentContextRegistry.isEmpty()) {
          DocumentContextRegistry.register(id, new DocumentContext(id));
        }
        return `[${protocolVersion},${id}]`;
    }
}