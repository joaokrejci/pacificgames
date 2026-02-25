"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_dao_1 = __importDefault(require("../model/server_dao"));
class SessionBO {
    static instance = new SessionBO();
    async interpretCommand(command) {
        if (!command.game) {
            return { error: "Game is needed" };
        }
        const server = server_dao_1.default.instance.getServer(command.game);
        if (!server) {
            return { error: "Server is unavailable" };
        }
        return server.sendCommand(command);
    }
}
exports.default = SessionBO;
//# sourceMappingURL=session-bo.js.map