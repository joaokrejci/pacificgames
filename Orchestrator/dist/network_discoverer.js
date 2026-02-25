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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dgram = __importStar(require("node:dgram"));
const entities_1 = require("./model/entities");
const server_dao_1 = __importDefault(require("./model/server_dao"));
class NetworkDiscoverer {
    async start(host, port) {
        const server = dgram.createSocket("udp4");
        server.on('listening', () => {
            const address = server.address();
            console.log(`UDP Receiver listening on ${address.address}:${address.port}`);
        });
        server.on('message', (message, remote) => {
            if (message.toString().startsWith("PG:")) {
                const parts = message.toString().split(':');
                if (parts.length < 3) {
                    return;
                }
                server_dao_1.default.instance.touch(new entities_1.Server(remote.address, Number.parseInt(parts[2]), parts[1], new Date()));
            }
        });
        server.on('error', (err) => {
            console.error(`Server error:\n${err.stack}`);
            server.close();
        });
        server.bind(port, host);
    }
}
exports.default = NetworkDiscoverer;
//# sourceMappingURL=network_discoverer.js.map