// someService.js
import { createWebSocketClient } from '../webSocketClientFactory.js';

export async function performDynamicWebSocketOperation(endpoint, data) {
  const wsClient = createWebSocketClient(endpoint);

  wsClient.on('open', () => {
    wsClient.send(JSON.stringify(data));
  });

  wsClient.on('message', (message) => {
    console.log('Server response:', message);
  });

  wsClient.on('close', () => {
    console.log('WebSocket operation completed');
  });
}
