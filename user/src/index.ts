import { WebSocketServer, WebSocket } from "ws";
import { createClient } from "redis";
import http from "http";

const PORT = process.env.PORT || 8001;
const redisClient = createClient();
const server = http.createServer();
const wss = new WebSocketServer({ server });
const clientMap = new Map<string, WebSocket>();

wss.on("connection", function (socket) {
  socket.on("error", console.error);

  socket.on("message", async (message: string, isBinary) => {
    let data: Data = JSON.parse(message);
    console.log("socket", data);
    clientMap.set(data.userid, socket);
  });

  socket.send("Hello from server");
});

async function startServer() {
  try {
    await redisClient.connect();
    console.log("Redis connected succesfully");
    await redisClient.SUBSCRIBE("problems", (message: string) => {
      console.log(message);
      const { problem, code, language } = JSON.parse(message);
      console.log(problem, code, language);
      const client = clientMap.get(problem);
      if (client && client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({ problem, code, language }));
      }
    });
    server.listen(PORT, () => {
      console.log(`Listening at PORT ${PORT}`);
    });
  } catch (err) {
    console.log("Some error occured\n", err);
  }
}

interface Data {
  userid: string;
}

startServer();
