import { Player, Server, Session } from "./entities";

class SessionDAO {
  sessions: Record<string, Session> = {};

  public static readonly instance = new SessionDAO();

  private key(game: string, sessionId: string): string {
    return `${game}:${sessionId}`;
  }

  public touch(server: Server, player: Player, sessionId: string, game: string) {
    const key = this.key(game, sessionId);
    let session: Session = this.sessions[key];
    if (!session || session.isDead) {
      session = new Session(sessionId, server);
    }
    if (!session.players.some(({ id }) => player.id === id)) {
      session.players.push(player);
    }
    this.sessions[key] = session;
  }

  public putSession(session: Session, game: string) {
    const key = this.key(game, session.id);
    this.sessions[key] = session;
  }

  public getSession(sessionId: string, game: string) {
    const key = this.key(game, sessionId);
    return this.sessions[key];
  }
}

export default SessionDAO;
