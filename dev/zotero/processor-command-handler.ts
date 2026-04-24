import DocumentContext from "./models/document-context";
import DocumentField from "./models/document-field";
import DocumentContextRegistry from "./context-registry";
import GetActiveDocumentHandler from "./handlers/get-active-doc-handler";
import GetDocumentDataHandler from "./handlers/get-document-data-handler";
import ZoteroServerCommandHandler from "./zotero-server-command-handler";

export default class ProcessorCommandHandler {
  static delegates: Array<ZoteroServerCommandHandler> = [
    new GetActiveDocumentHandler(),
    new GetDocumentDataHandler()
  ]

  static handleCommand(message: [command: string, args: any]): string {
    let command = message[0];
    let args = message[1];

    switch (command) {
      case "Application_getActiveDocument":
        return this.handleGetActiveDocument(args);
      case "Document_getDocumentData":
        return this.handleGetDocumentData(args);
      case "Document_cursorInField":
        return this.handleCursorInField(args);
      case "Document_canInsertField":
        return this.handleCanInsertField(args);
      case "Document_insertField":
        return this.handleInsertField(args);
      case "Field_setCode":
        return this.handleSetFieldCode(args);
      case "Document_getFields":
        return this.handleGetFields(args);
      case "Field_setText":
        return this.handleSetFieldText(args);
      case "Field_getText":
        return this.handleFieldGetText(args);
      case "Document_setDocumentData":
        return this.handleSetDocumentData(args);
      case "Document_activate":
        return this.handleReturningNull(args);
      case "Document_complete":
        return this.handleReturningNull(args);
      case "Field_delete":
        return this.handleDeleteField(args);
      case "Field_select":
        return this.handleReturningNull(args);
      default:
        console.warn(`COMMAND NOT SUPPORTED: ${command}`);
    }
  }

  static handleGetActiveDocument(args: [protocolVersion: number]): string {
    let protocolVersion = args[0];
    let id = 1
    if (DocumentContextRegistry.isEmpty()) {
      DocumentContextRegistry.register(id, new DocumentContext(id));
    }
    return `[${protocolVersion},${id}]`;
  }

  static handleGetDocumentData(args: [id: number]): string {
    let context = DocumentContextRegistry.getDocumentById(args[0]);
    return `"${context.getDocumentData()}"`;
  }

  static handleCursorInField(args: [docId: number, fieldType: string]): string {
    let field = DocumentContextRegistry.getFieldByDocumentId(args[0]);
    if (field == undefined || field == null)
      return 'null';

    // .replace(/plainCitation\\":(.+),\\"note/, 'plainCitation\\":\\"$1\\",\\"note')

    return `[${field.getId()},"${field.getCode().replace(/"/g, '\\"')}",0]`;
  }

  static handleCanInsertField(args: [docId: number, fieldType: string]): string {
    return 'true';
  }

  static handleInsertField(args: [docId: number, fieldType: string, noteType: number]) {
    let context = DocumentContextRegistry.getDocumentById(args[0]);
    let fieldId = 0;
    let field = new DocumentField(fieldId);
    context.insertField(field);
    return `[${fieldId},"${field.getCode()}",${args[2]}]`;
  }

  static handleSetFieldCode(args: [docId: number, fieldId: number, code: string]): string {
    let field = DocumentContextRegistry.getFieldByDocumentId(args[0]);
    field.setCode(args[2]);
    return 'null';
  }

  static handleGetFields(args: [docId: number, fieldType: string]): string {
    let field = DocumentContextRegistry.getFieldByDocumentId(args[0]);

    return `[[${field.getId()}],["${field.getCode().replace(/"/g, '\\"')}"],[0],[-1]]`;
  }

  static handleSetFieldText(args: [docId: number, fieldId: number, text: string, isRich: boolean]): string {
    let field = DocumentContextRegistry.getFieldByDocumentId(args[0]);
    field.setText(args[2]);
    return 'null';
  }

  static handleFieldGetText(args: [docId: number, fieldId: number]): string {
    let field = DocumentContextRegistry.getFieldByDocumentId(args[0]);
    return `"${field.getText()}"`;
  }

  static handleSetDocumentData(args: [docId: number, data: string]): string {
    let context = DocumentContextRegistry.getDocumentById(args[0]);
    context.setDocumentData(args[1]);
    return 'null';
  }

  static handleDeleteField(args: [docId: number, fieldId: number]): string {
    return 'null';
  }

  static handleReturningNull(args: any): string {
    return 'null';
  }
}