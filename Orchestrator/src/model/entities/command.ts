import { Player } from "./player";
import { Session } from "./session";

enum CommandAction {
  SUBSCRIBE = "subscribe_to_session",
  JOIN = "join_session",
  PLACE = "place",
  TAKE = "take",
}

interface Command {
  action: CommandAction;
  parameter?: string;
  session: Session;
  player: Player;
  game: string;
}

export { CommandAction };
export default Command;
