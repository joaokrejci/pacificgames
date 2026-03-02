import {
  Result,
  ResultType,
  Server,
  Session,
  SessionResult,
} from "../model/entities";

import Command, { CommandAction } from "../model/entities/command";
import ServerDAO from "../model/server_dao";
import SessionDAO from "../model/session_dao";

type InterpretCommandParams = {
  command: Command;
  notifyUpdate?: (update: Result) => void;
};

class SessionBO {
  public static readonly instance = new SessionBO();

  private error(message: string): Result {
    return { type: ResultType.ERROR, data: { message: message } };
  }

  async joinSession(command: Command) {
    if (!command.game) {
      return this.error("Game is needed");
    }

    const server: Server = ServerDAO.instance.getServer(command.game);
    if (!server) {
      return this.error("Server is unavailable");
    }

    const result: Result = await server.sendCommand(command);
    if (result.type === ResultType.SESSION) {
      SessionDAO.instance.touch(
        server,
        command.player,
        (result.data as SessionResult)?.id,
        command.game,
      );
    }

    return result;
  }

  async interpretCommand({
    command,
    notifyUpdate,
  }: InterpretCommandParams): Promise<Result> {
    if (!command.game) {
      return this.error("Game is needed");
    }

    if (command.action === CommandAction.ABANDON) {
      const server: Server = ServerDAO.instance.getServer(command.game);
      if (server) {
        try { await server.sendCommand(command); } catch (_) { /* best effort */ }
      }
      const session: Session = SessionDAO.instance.getSession(
        command.session?.id,
        command.game,
      );
      if (session && !session.isDead) {
        session.markAbandoned();
      }
      return { type: ResultType.STATUS, data: { status: 'OVER', info: 'ABANDONED' } };
    }

    const session: Session = SessionDAO.instance.getSession(
      command.session?.id,
      command.game,
    );
    if (!session || session.isDead) {
      return this.error("Session not found");
    }
    return await session.interpretCommand(command, notifyUpdate)
  }

  unsubscribeObserver(observer: (update: Result) => void) {
    for (const session of Object.values(SessionDAO.instance.sessions)) {
      (session as Session).unsubscribe(observer);
    }
  }
}

export default SessionBO;
