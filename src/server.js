import dotenv from "dotenv";
dotenv.config();

import app from "./app.js"; // Express app
import db from "../models/index.js"; // Sequelize models
// import redisClient from "../connectRedis.js"; // Redis client
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
    // const isRedisConnected = await redisClient.ping();
    // if (isRedisConnected !== "PONG") {
    //   throw new Error("Redis not connected");
    // }
    // console.log("Redis is ready");

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
          // connectedAgents.set(agentId, ws);
          connectedAgents.set(agentId, {
            total_cpu: message.resources.cpu,
            cpu_usage: 0,
            total_memory: message.resources.memory,
            memory_usage: 0,
            num_runners: 0,
            endpoint: ws,
          });
        } else if (message.type === "taskComplete") {
          const { taskId, result, metrics } = message;
          console.log(
            `Task ${taskId} completed:`,
            JSON.stringify(result, null, 2)
          );
          console.log("okokokok");
          console.log(metrics);

          if (pendingTasks.has(taskId)) {
            pendingTasks.get(taskId).resolve({ success: true, data: message });
            pendingTasks.delete(taskId);
          }
        } else if (message.type === "taskError") {
          const { taskId, error } = message;
          console.error(
            `Task ${taskId} failed:`,
            JSON.stringify(error, null, 2)
          );

          if (pendingTasks.has(taskId)) {
            // pendingTasks.get(taskId).reject(new Error(error || "Task error"));
            // pendingTasks.delete(taskId);
            pendingTasks.get(taskId).resolve({
              success: false,
              data: error,
            });
            pendingTasks.delete(taskId);
          }
        } else if (message.type === "resourceUpdate") {
          console.log(
            `Agent ${message.agentId} resources:`,
            JSON.stringify(message.metrics, null, 2)
          );
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
  } catch (error) {
    console.error("Server initialization error:", error);
    process.exit(1);
  }
})();
