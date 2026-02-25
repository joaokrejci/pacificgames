"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class PlayerDAO {
    static instance = new PlayerDAO();
    players = {};
    insert(name) {
        const id = crypto.randomUUID();
        const player = { id, name };
        this.players[id] = player;
        return player;
    }
    get(id) {
        return this.players[id];
    }
}
exports.default = PlayerDAO;
//# sourceMappingURL=player_dao.js.map