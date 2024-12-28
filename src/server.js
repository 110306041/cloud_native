import dotenv from "dotenv";
dotenv.config();
import app from "./app.js"; // ES module import
// import sequelize from "../syncDB.js"; // Your Sequelize instance
import db from "../models/index.js";
// import http from 'http';
// import { createClient } from "redis";
import { createServer } from "http";

import redisClient from "../connectRedis.js";
// import { Server as SocketServer } from "socket.io";
// import handleSocketEvents from "../socketHandler.js";

const PORT = process.env.PORT || 3000;
const SOCKET_PORT = process.env.SOCKET_PORT || 4000;


(async () => {
  try {
    // Check Redis connection
    const isRedisConnected = await redisClient.ping();
    if (isRedisConnected !== "PONG") {
      throw new Error("Redis not connected");
    }
    console.log("Redis is ready");

    // Test the DB connection
    await db.sequelize.authenticate();
    console.log("Database connected successfully!");

    // Sync all models
    await db.sequelize.sync(); // or sync({ alter: true }) / sync({ force: true })
    console.log("All models were synchronized successfully.");

    // Start the HTTP server
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });


  } catch (error) {
    console.error("Server initialization error:", error);
    process.exit(1);
  }
})();