"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const network_discoverer_js_1 = __importDefault(require("./network_discoverer.js"));
const http_server_js_1 = require("./http_server.js");
const discoverer = new network_discoverer_js_1.default();
discoverer.start('0.0.0.0', 17000);
(0, http_server_js_1.start)();
//# sourceMappingURL=index.cjs.map