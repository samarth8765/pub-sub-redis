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
const express_1 = __importDefault(require("express"));
const redis_1 = require("redis");
const app = (0, express_1.default)();
const PORT = process.env.PORT || 8000;
const redisClient = (0, redis_1.createClient)();
redisClient.on("error", (err) => console.log(`Redis client ${err}`));
app.use(express_1.default.json());
app.post("/submit", (req, res) => {
    try {
        const { problem, code, language } = req.body;
        redisClient.lPush("problems", JSON.stringify({ problem, code, language }));
        res.status(201).json({ status: "Problem submited" });
    }
    catch (err) {
        console.log("Some error", err);
        res.status(500).json({
            error: "Error occured",
        });
    }
});
function startServer() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield redisClient.connect();
            console.log("Connected to Redis");
            app.listen(PORT, () => {
                console.log(`Listening at PORT ${PORT}`);
            });
        }
        catch (err) {
            console.log(`Error during running the server ${err}`);
        }
    });
}
startServer();
