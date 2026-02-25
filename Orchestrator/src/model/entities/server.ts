import * as net from "node:net";

import Command, { CommandAction } from "./command";
import { Result, ResultType, SessionStatus } from "./result";

import readline from 'node:readline'

class Server {
  private readonly host: string;
  private readonly port: number;
  private readonly type: string;
  private readonly timestamp: Date;
  private socket: net.Socket | null;

  public constructor(
    host: string,
    port: number,
    type: string,
    timestamp: Date,
  ) {
    this.host = host;
    this.port = port;
    this.type = type;
    this.timestamp = timestamp;
    this.socket = null;
  }

  public async sendCommand(command: Command): Promise<Result> {
    if (!this.socket?.readable) {
      await this.open();
    }

    const io = readline.createInterface({input: this.socket, output: this.socket})
    const strCommand: string = `${this.formatCommand(command)}\n`;
    this.socket?.write(strCommand);
    console.log(`Sent command: ${strCommand}`)
    return await new Promise((resolve) => {
      io.on("line", (line) => {
        console.log(`Received response: ${line}`)
        resolve(this.formatResult(line));
      });
    });
  }

  private async open(): Promise<void> {
    this.socket = net.connect({
      host: this.host,
      port: this.port,
      noDelay: true,
    });
    return new Promise((resolve, reject) => {
      this.socket?.on("connect", () => {
        resolve();
      });
      this.socket?.on("error", (error) => {
        reject(error);
      });
    });
  }

  private formatCommand(
    command: Command,
  ): string | Uint8Array<ArrayBufferLike> {
    switch (command.action) {
      case CommandAction.JOIN:
        return `join_session:${command.player.id}`;
      case CommandAction.SUBSCRIBE:
        return `session_status:${command.session.id}`;
      case CommandAction.PLACE:
        return `place:${command.player.id}:${command.session.id}:${command.parameter}`;
      default:
        return "identity";
    }
  }

  private formatResult(message: string): Result {
    const [type, ...payload] = message.split(":");
    const result: Result = { type };
    switch (type) {
      case ResultType.ERROR:
        result.data = { message: payload[0] };
        break;

      case ResultType.SESSION:
        result.data = { id: payload[0] };
        break;

      case ResultType.STATUS: {
        const [status, info] = payload;
        switch (status) {
          case SessionStatus.INCOMPLETE:
          case SessionStatus.OVER:
            result.data = { status, info };
            break;

          default: {
            const [board, nextPlayer] = payload;
            result.data = {
              status: SessionStatus.BOARD,
              info: board,
              nextPlayer: nextPlayer,
            };
            break;
          }
        }
        break;
      }

      default:
        break;
    }

    return result;
  }
}

export { Server };
