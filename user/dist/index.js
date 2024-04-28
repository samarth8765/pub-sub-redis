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
const redis_1 = require("redis");
const http_1 = __importDefault(require("http"));
const PORT = process.env.PORT || 8001;
const redisClient = (0, redis_1.createClient)();
const server = http_1.default.createServer();
const wss = new ws_1.WebSocketServer({ server });
wss.on("connection", function (socket) {
    socket.on("error", console.error);
    socket.on("message", (data, isBinary) => { });
    socket.send("Hello from server");
    socket.on("close", (code, reason) => {
        socket.send("connceciton closed");
        console.log("conenction close", code, reason);
    });
});
function startServer() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield redisClient.connect();
            console.log("Redis connected succesfully");
            server.listen(PORT, () => {
                console.log(`Listening at PORT ${PORT}`);
            });
        }
        catch (err) {
            console.log("Some error occured\n", err);
        }
    });
}
startServer();
