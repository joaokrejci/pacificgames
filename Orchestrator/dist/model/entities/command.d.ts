import { Player } from "./player";
import { Session } from "./session";
interface Command {
    action: string;
    session: Session;
    player: Player;
    game: string;
}
export default Command;
//# sourceMappingURL=command.d.ts.map