// import * as vscode from "vscode";
// import ZoteroClient from "../client/zotero/zotero-client";
// import Command from "../commands/command";

// export default class SendMessageToZoteroCommand implements Command {
//     client: ZoteroClient;

//     constructor(client: ZoteroClient) {
//         this.client = client;
//     }

//     execute(): void {
//         vscode.window.showInputBox({prompt: "ID"})
//             .then((input) => {
//                 if (input == null || input ==undefined)
//                     return;
//                 let id = Number.parseInt(input);
//                 vscode.window.showInputBox({prompt: "Mensagem"})
//                     .then((input2) => {
//                         if (input2 == null || input ==undefined)
//                             return;
//                         this.client.sendMessage(id, input2);
//                     })
//             })
//     }

// }