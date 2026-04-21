import * as net from 'net';
import { deserializeRpcMessage, createRpcPayload as serializeRpcPayload } from './io';
import ZoteroServerCommand from './zotero-server-commands';
import ProcessorCommandHandler from './processor-command-handler';

let RECEIVED_COUNT = 0;

export default class ZoteroClient {
  socket: net.Socket;
  receivedCount = 0;

  handleData: (data: Buffer) => void;
  sendMessage: (transactionId: number, payload: string) => void;

  connect() {
    this.socket = net.createConnection(23116, 'localhost', () => {});

    this.sendMessage = (transactionId:number, payload:string) => {
      let message = serializeRpcPayload(transactionId, payload);
      this.socket.write(message);
    }

    this.handleData = (data:Buffer) => {
      console.log(deserializeRpcMessage(data));
      RECEIVED_COUNT++;
      let message = deserializeRpcMessage(data) as any as [command:string, args: unknown];

      let response = ProcessorCommandHandler.handleCommand(message);
      this.sendMessage(RECEIVED_COUNT, response);
      // if (message[0] == ZoteroServerCommand.GET_ACTIVE_DOCUMENT) {
      //   let protocolVersion = (message[1] as Array<number>)[0];
      //   this.sendMessage(RECEIVED_COUNT, `[${protocolVersion},1]`)
      // }
    }

    this.socket.on('data', this.handleData);
  }
}