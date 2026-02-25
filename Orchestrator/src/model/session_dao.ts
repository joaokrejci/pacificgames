import { Player, Server, Session } from "./entities";

class SessionDAO {
  sessions: Record<string, Session> = {};

  public static readonly instance = new SessionDAO();

  public touch(server: Server, player: Player, sessionId: string) {
    const session: Session = this.sessions[sessionId] || new Session(sessionId, server);
    if (!session.players.some(({ id }) => player.id === id)) {
      session.players.push(player);
    }
    this.sessions[sessionId] = session;
  }

  public putSession(session: Session) {
    this.sessions[session.id] = session;
  }

  public getSession(sessionId: string) {
    return this.sessions[sessionId];
  }
}

export default SessionDAO;
