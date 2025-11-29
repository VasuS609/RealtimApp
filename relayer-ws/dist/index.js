"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
const http_1 = __importDefault(require("http"));
const server = http_1.default.createServer();
const wss = new ws_1.WebSocketServer({ server });
wss.on('connection', (ws) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("user is connected");
    ws.send("client is connected");
    ws.on('error', () => { console.error; });
    ws.on('message', (data) => {
        wss.clients.forEach((client) => {
            if (client.readyState == ws.OPEN) {
                client.send(data.toString());
            }
        });
        ws.on('close', () => {
            ws.send("user has been disconnected");
        });
    });
}));
server.listen(8080, () => {
    console.log("server is running on port 8080");
});
