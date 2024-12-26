import dotenv from "dotenv";
dotenv.config();
import app from "./app.js"; // ES module import
import sequelize from "../syncDB.js"; // Your Sequelize instance
// import http from 'http';
// import { createClient } from "redis";
import redisClient from "../connectRedis.js";

const PORT = process.env.PORT || 3000;

try {
  const isRedisConnected = await redisClient.ping();
  if (isRedisConnected !== "PONG") {
    throw new Error("Redis not connected");
  }
  console.log("Redis is ready");
} catch (error) {
  console.error("Redis connection issue:", error);
  process.exit(1);
}
sequelize.sync().then(() => {
  console.log("Database connected and synced!");

  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
});
