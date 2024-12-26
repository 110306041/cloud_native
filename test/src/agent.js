import WebSocket from "ws";

class Agent {
    constructor(wServerUrl, onMessage) {
    // constructor(wServerUrl) {
        this.ws = new WebSocket(wServerUrl);
        this.ws.onopen = () => console.log('Connected to Web Server');
        this.ws.onclose = () => console.log('Disconnected from Web Server');
        this.ws.onmessage = onMessage
    }

    sendMessage(message) {
        this.ws.send(JSON.stringify(message));
    }
}

export default Agent