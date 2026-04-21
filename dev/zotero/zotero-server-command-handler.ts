export default interface ZoteroServerCommandHandler {
    shouldHandle(command: string): boolean;
    handle(args: any): string;
}