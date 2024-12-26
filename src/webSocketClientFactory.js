// webSocketClientFactory.js
import WebSocket from 'ws';

export function createWebSocketClient(endpoint) {
  const ws = new WebSocket(endpoint);

  ws.on('open', () => {
    console.log(`WebSocket connected to ${endpoint}`);
  });

  ws.on('message', (message) => {
    console.log('Received message:', message);
  });

  ws.on('close', () => {
    console.log(`WebSocket connection to ${endpoint} closed`);
  });

  ws.on('error', (error) => {
    console.error(`WebSocket error on ${endpoint}:`, error);
  });

  return ws;
}
