"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Server = void 0;
const net = __importStar(require("node:net"));
const result_1 = require("./result");
class Server {
    host;
    port;
    type;
    timestamp;
    socket;
    constructor(host, port, type, timestamp) {
        this.host = host;
        this.port = port;
        this.type = type;
        this.timestamp = timestamp;
        this.socket = null;
    }
    async open() {
        this.socket = net.connect({
            host: this.host,
            port: this.port,
            noDelay: true
        });
        return new Promise((resolve, reject) => {
            this.socket?.on("connect", () => {
                resolve();
            });
            this.socket?.on("error", (error) => {
                reject(error);
            });
        });
    }
    async sendCommand(command) {
        if (!this.socket || !this.socket.readable) {
            await this.open();
        }
        this.socket?.write(this.formatCommand(command));
        return await new Promise((resolve, reject) => {
            this.socket?.on('data', (message) => {
                resolve(this.formatResult(message.toString()));
            });
        });
    }
    formatCommand(command) {
        switch (command.action) {
            case 'join_session':
                return `join_session:${command.player.id}`;
            default:
                return 'identity';
        }
    }
    formatResult(message) {
        const [type, ...payload] = message.split(':');
        const result = { type };
        switch (type) {
            case result_1.ResultType.ERROR:
                result.data = { message: payload[0] };
                break;
            case result_1.ResultType.SESSION:
                result.data = { id: payload[0] };
                break;
            case result_1.ResultType.STATUS:
                const [status, info, nextPlayer] = payload;
                switch (status) {
                    case result_1.SessionStatus.INCOMPLETE:
                    case result_1.SessionStatus.OVER:
                        result.data = { status, info };
                        break;
                    default:
                        result.data = {
                            status: result_1.SessionStatus.BOARD,
                            info,
                            nextPlayer
                        };
                        break;
                }
            default:
                break;
        }
        return result;
    }
}
exports.Server = Server;
//# sourceMappingURL=server.js.map