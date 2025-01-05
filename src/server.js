import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import db from "../models/index.js";
import { createServer } from "http";
import { WebSocketServer } from "ws";

const connectedAgents = new Map();
const pendingTasks = new Map();

export { connectedAgents, pendingTasks };

const HTTP_PORT = process.env.PORT || 3000;
const WS_PORT = process.env.SOCKET_PORT || 4000;

(async () => {
  try {
    await db.sequelize.authenticate();
    console.log("Database connected successfully!");

    await db.sequelize.sync();
    console.log("All models were synchronized successfully.");

    const httpServer = createServer(app);
    httpServer.listen(HTTP_PORT, () => {
      console.log(`HTTP Server is running on http://localhost:${HTTP_PORT}`);
    });

    const wss = new WebSocketServer({ port: WS_PORT });
    console.log(`WebSocket Server is running on ws://localhost:${WS_PORT}`);

    wss.on("connection", (ws) => {
      console.log("New WebSocket connection established");

      ws.on("message", (data) => {
        const message = JSON.parse(data);
        console.log("Received message:", JSON.stringify(message, null, 2));

        if (message.type === "register") {
          const { agentId } = message;
          console.log(`Agent ${agentId} registered`);
          connectedAgents.set(agentId, {
            total_cpu: message.resources.cpu,
            cpu_usage: 0,
            total_memory: message.resources.memory,
            memory_usage: 0,
            endpoint: ws,
          });
        } else if (message.type === "taskComplete") {
          const { taskId, result, metrics } = message;
          console.log(
            `Task ${taskId} completed:`,
            JSON.stringify(result, null, 2)
          );
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
          const existingAgent = connectedAgents.get(message.agentId);

          if (existingAgent) {
            connectedAgents.set(message.agentId, {
              ...existingAgent,
              total_cpu: message.metrics.cpu.total,
              cpu_usage: message.metrics.cpu.used,
              total_memory: message.metrics.memory.total,
              memory_usage: message.metrics.memory.used,
            });
          } else {
            console.warn(
              `Agent ${message.agentId} not found. Cannot update resources.`
            );
          }
        }
      });

      ws.on("close", () => {
        for (const [agentId, agent] of connectedAgents.entries()) {
          console.log(agent);
          if (agent.endpoint === ws) {
            console.log(`Agent ${agentId} disconnected`);
            connectedAgents.delete(agentId);
            console.log("logging connectedAgent maps");
            console.log(connectedAgents);

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
