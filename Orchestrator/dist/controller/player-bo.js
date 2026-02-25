"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const player_dao_js_1 = __importDefault(require("../model/player_dao.js"));
class PlayerBO {
    static instance = new PlayerBO();
    insert(name) {
        return player_dao_js_1.default.instance.insert(name);
    }
    get(id) {
        player_dao_js_1.default.instance.get(id);
    }
}
exports.default = PlayerBO;
//# sourceMappingURL=player-bo.js.map