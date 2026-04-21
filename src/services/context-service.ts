import { commands, ExtensionContext } from "vscode";
import ContextKeys from "../constants/context-keys";

class ContextService {
  private static extensionContext: ExtensionContext;

  public static setExtensionContext(context: ExtensionContext): void {
    ContextService.extensionContext = context;
  }

  public static getExtensionContext(): ExtensionContext {
    return ContextService.extensionContext;
  }

  public static getExtensionPath(): string {
    return ContextService.extensionContext.extensionPath;
  }

  public static setIsActiveSourceContext(value: boolean): void {
    commands.executeCommand('setContext', ContextKeys.CSL_SOURCE_ACTIVE, value);
  }

  public static setIsPreviewActiveContext(value: boolean): void {
    commands.executeCommand('setContext', ContextKeys.CSL_PREVIEW_ACTIVE, value);
  }
}

export default ContextService;