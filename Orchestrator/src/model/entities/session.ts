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
  private readonly observers: Array<(update: Result) => void> = [];
  private next?: Player;
  private timeout: NodeJS.Timeout;
  private gameStarted = false;
  private abandonTimeout: NodeJS.Timeout | null = null;
  private dead = false;

  public get isDead(): boolean {
    return this.dead;
  }

  public get nextPlayer(): Player {
    return this.next;
  }

  public subscribe(observer: (update: Result) => void) {
    if (!this.observers.includes(observer)) {
      this.observers.push(observer);
    }
    if (this.abandonTimeout) {
      clearTimeout(this.abandonTimeout);
      this.abandonTimeout = null;
    }
  }

  public unsubscribe(observer: (update: Result) => void) {
    const index = this.observers.indexOf(observer);
    if (index < 0) return;

    this.observers.splice(index, 1);

    if (this.players.length >= 2 && this.observers.length > 0) {
      this.abandonTimeout = setTimeout(() => {
        this.abandonTimeout = null;
        if (this.observers.length > 0) {
          this.clearSession();
        }
      }, 1500);
    }
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

  public async interpretCommand(command: Command, notifyUpdate: (update: Result) => void): Promise<Result> {
    this.debounce();

    if (command.action === CommandAction.SUBSCRIBE) {
      this.subscribe(notifyUpdate);
    }

    if (command.action === CommandAction.ABANDON) {
      this.clearSession();
      return { type: ResultType.STATUS, data: { status: 'OVER', info: 'ABANDONED' } };
    }

    const result: Result = await this.server.sendCommand(command);

    if (result.type !== ResultType.ERROR) {
      this?.update(result);
    }

    return result;
  }

  private debounce() {
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      this.clearSession();
    }, Session.FIVE_MINUTES);
  }

  private clearSession() {
    this.dead = true;
    const result: Result = {
      type: 'STATUS',
      data: {
        status: 'OVER',
        info: 'ABANDONED'
      }
    };
    this.update(result);
  }

  public markAbandoned() {
    this.clearSession();
  }
}

export { Session };
