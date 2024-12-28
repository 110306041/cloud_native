import dotenv from "dotenv";
dotenv.config();
import { createClient } from "redis";

const redisClient = createClient({
  socket: {
    host: process.env.REDIS_HOST,
    port: 6379,
  },
});

redisClient.on("error", (err) => console.error("Redis Client Error:", err));

(async () => {
  try {
    await redisClient.connect();
    console.log("Connected to Redis successfully");
  } catch (error) {
    console.error("Failed to connect to Redis:", error);
  }
})();

export default redisClient;



