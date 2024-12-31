// import dotenv from "dotenv";
// dotenv.config();
// import app from "./app.js"; // ES module import
// // import sequelize from "../syncDB.js"; // Your Sequelize instance
// import db from "../models/index.js";
// // import http from 'http';
// // import { createClient } from "redis";
// import { createServer } from "http";

// import redisClient from "../connectRedis.js";
// // import { Server as SocketServer } from "socket.io";
// // import handleSocketEvents from "../socketHandler.js";

// const PORT = process.env.PORT || 3000;
// const SOCKET_PORT = process.env.SOCKET_PORT || 4000;


// (async () => {
//   try {
//     // Check Redis connection
//     const isRedisConnected = await redisClient.ping();
//     if (isRedisConnected !== "PONG") {
//       throw new Error("Redis not connected");
//     }
//     console.log("Redis is ready");

//     // Test the DB connection
//     await db.sequelize.authenticate();
//     console.log("Database connected successfully!");

//     // Sync all models
//     await db.sequelize.sync(); // or sync({ alter: true }) / sync({ force: true })
//     console.log("All models were synchronized successfully.");

//     // Start the HTTP server
//     app.listen(PORT, () => {
//       console.log(`Server is running on http://localhost:${PORT}`);
//     });


//   } catch (error) {
//     console.error("Server initialization error:", error);
//     process.exit(1);
//   }
// })();



import dotenv from "dotenv";
dotenv.config();

import app from "./app.js"; // Express app
import db from "../models/index.js"; // Sequelize models
import redisClient from "../connectRedis.js"; // Redis client
import { createServer } from "http";
import { WebSocketServer } from "ws";
import { v4 as uuidv4 } from "uuid";

/** 
 * We keep these in memory:
 * connectedAgents: key=agentId, value=WebSocket instance
 * pendingTasks: key=taskId, value={ resolve, reject }
 */
const connectedAgents = new Map();
const pendingTasks = new Map();

export { connectedAgents, pendingTasks }; // We’ll import these in handleRequest.js if needed

const HTTP_PORT = process.env.PORT || 3000;
const WS_PORT = process.env.SOCKET_PORT || 4000;

(async () => {
  try {
    // 1. Check Redis connection
    const isRedisConnected = await redisClient.ping();
    if (isRedisConnected !== "PONG") {
      throw new Error("Redis not connected");
    }
    console.log("Redis is ready");

    // 2. Test the DB connection
    await db.sequelize.authenticate();
    console.log("Database connected successfully!");

    // 3. Sync all models
    await db.sequelize.sync(); // or sync({ alter: true }) / sync({ force: true })
    console.log("All models were synchronized successfully.");

    // 4. Start the HTTP server
    const httpServer = createServer(app);
    httpServer.listen(HTTP_PORT, () => {
      console.log(`HTTP Server is running on http://localhost:${HTTP_PORT}`);
    });

    // 5. Start the WebSocket server
    const wss = new WebSocketServer({ port: WS_PORT });
    console.log(`WebSocket Server is running on ws://localhost:${WS_PORT}`);

    wss.on("connection", (ws) => {
      console.log("New WebSocket connection established");

      ws.on("message", (data) => {
        const message = JSON.parse(data);
        console.log("Received message:", JSON.stringify(message, null, 2));

        if (message.type === "register") {
          // Example: { type: "register", agentId: "worker-xyz" }
          const { agentId } = message;
          console.log(`Agent ${agentId} registered`);
          connectedAgents.set(agentId, ws);
        }

        else if (message.type === "taskComplete") {
          // Example: { type: "taskComplete", taskId: "...", result: {...} }
          const { taskId, result } = message;
          console.log(`Task ${taskId} completed:`, JSON.stringify(result, null, 2));

          if (pendingTasks.has(taskId)) {
            pendingTasks.get(taskId).resolve(result);
            pendingTasks.delete(taskId);
          }
        }

        else if (message.type === "taskError") {
          // Example: { type: "taskError", taskId: "...", error: "...error details..." }
          const { taskId, error } = message;
          console.error(`Task ${taskId} failed:`, JSON.stringify(error, null, 2));

          if (pendingTasks.has(taskId)) {
            // pendingTasks.get(taskId).reject(new Error(error || "Task error"));
            // pendingTasks.delete(taskId);
            pendingTasks.get(taskId).resolve({
              success: false,
              data: error
            });
            pendingTasks.delete(taskId);
          }
        }

        else if (message.type === "resourceUpdate") {
          console.log(`Agent ${message.agentId} resources:`, JSON.stringify(message.metrics, null, 2));
          // Possibly update some internal data structure
        }
      });

      ws.on("close", () => {
        for (const [agentId, agent] of connectedAgents.entries()) {
          if (agent === ws) {
            console.log(`Agent ${agentId} disconnected`);
            connectedAgents.delete(agentId);
            break;
          }
        }
      });
    });

    // 6. Example REST API to send tasks (not necessarily needed if you have handleRequest)
   
  } catch (error) {
    console.error("Server initialization error:", error);
    process.exit(1);
  }
})();
