import express from "express";
import { createClient } from "redis";

const app = express();
const PORT = process.env.PORT || 8000;
const redisClient = createClient();
redisClient.on("error", (err) => console.log(`Redis client ${err}`));

app.use(express.json());

app.post("/submit", async (req, res) => {
  try {
    const { problem, code, language } = req.body;
    await redisClient.lPush(
      "problems",
      JSON.stringify({ problem, code, language })
    );
    res.status(201).json({ status: "Problem submited" });
  } catch (err) {
    console.log("Some error", err);
    res.status(500).json({
      error: "Error occured",
    });
  }
});

async function startServer() {
  try {
    await redisClient.connect();
    console.log("Connected to Redis");

    app.listen(PORT, () => {
      console.log(`Listening at PORT ${PORT}`);
    });
  } catch (err) {
    console.log(`Error during running the server ${err}`);
  }
}

startServer();
