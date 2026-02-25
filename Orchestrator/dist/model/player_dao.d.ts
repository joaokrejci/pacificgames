import { Player } from "./entities";
export default class PlayerDAO {
    static instance: PlayerDAO;
    players: Record<string, Player>;
    insert(name: string): {
        id: `${string}-${string}-${string}-${string}-${string}`;
        name: string;
    };
    get(id: string): Player;
}
//# sourceMappingURL=player_dao.d.ts.map