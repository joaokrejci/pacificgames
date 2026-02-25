"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.start = start;
const player_bo_js_1 = __importDefault(require("./controller/player-bo.js"));
const session_bo_js_1 = __importDefault(require("./controller/session-bo.js"));
const express_1 = __importDefault(require("express"));
const express_ws_1 = __importDefault(require("express-ws"));
async function start() {
    const app = (0, express_1.default)();
    (0, express_ws_1.default)(app);
    app.post("/register-player", (request, response) => {
        request.on("data", data => {
            try {
                const { name } = JSON.parse(data);
                const player = player_bo_js_1.default.instance.insert(name);
                response
                    .status(200)
                    .setHeader("Content-Type", "application/json")
                    .send(JSON.stringify(player));
                response.end();
            }
            catch (error) {
                response
                    .status(400)
                    .send(JSON.stringify(error));
                response.end();
            }
        });
    });
    app.ws('/game', (ws, request) => {
        ws.on('message', async (ms) => {
            const json = JSON.parse(ms.toString());
            if (!json) {
                ws.send(JSON.stringify({ error: "Invalid command" }));
            }
            const result = await session_bo_js_1.default.instance.interpretCommand(json);
            ws.send(JSON.stringify(result));
        });
    });
    app.listen(3000, () => {
        console.log("Server listening on port " + 3000);
    });
    return app;
}
//# sourceMappingURL=http_server.js.map