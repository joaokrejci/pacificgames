import Command, { CommandAction } from "./command";
import { Result, ResultType, SessionStatus, StatusResult } from "./result";

import { Player } from "./player";
import { Server } from "./server";

class Session {
  public constructor(id: string, server: Server) {
    this.id = id;
    this.server = server;
  }

  private static readonly FIVE_MINUTES: number = 1000 * 60 * 5;

  private readonly server: Server;
  public readonly id: string;
  public readonly players: Player[] = [];
  private readonly observers = [];
  private next?: Player;
  private timeout: NodeJS.Timeout;

  public get nextPlayer(): Player {
    return this.next;
  }

  public subscribe(observer: (update: Result) => void) {
    this.observers.push(observer);
  }

  public update(result: Result) {
    if (
      result.type === ResultType.STATUS &&
      (result.data as StatusResult)?.status === SessionStatus.BOARD
    ) {
      const nextPlayerId = (result.data as StatusResult)?.nextPlayer;
      this.next = this.players.find(({ id }) => id == nextPlayerId);
    }

    this.observers.forEach((observer: (update: Result) => void) => {
      observer(result);
      observer({
        type: "SESSION",
        data: {
          id: this.id,
          players: this.players,
          nextPlayer: this.nextPlayer,
        },
      });
    });
  }

  public async interpretCommand(command: Command, notifyUpdate: (update: Result) => void) {
    this.debounce();

    if (command.action === CommandAction.SUBSCRIBE) {
      this.subscribe(notifyUpdate);
    }

    const result: Result = await this.server.sendCommand(command);
    this?.update(result);
  }

  private debounce() {
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      this.clearSession();
    }, Session.FIVE_MINUTES);
  }

  private clearSession() {
    const result: Result = {
      type: 'STATUS',
      data: {
        status: 'OVER',
        info: 'ABANDONED'
      }
    };
    this.update(result);
  }
}

export { Session };
