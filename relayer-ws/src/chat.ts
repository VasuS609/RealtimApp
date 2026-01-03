import { WebSocketServer, WebSocket } from "ws";
const CHAT_PORT = Number(process.env.CHAT_PORT) || 8082;
const wss = new WebSocketServer({ port: CHAT_PORT });

wss.on("connection", (ws) => {
  console.log("Chat WS client connected");
  
  // Send message to all clients EXCEPT the sender
  ws.on("message", (message) => {
    const messageStr = message.toString();
    
    // Validate message size (max 10KB)
    if (messageStr.length > 10240) {
      ws.send(JSON.stringify({ error: "Message too large" }));
      return;
    }
    
    // Validate JSON format
    try {
      JSON.parse(messageStr);
    } catch (e) {
      console.error("Invalid JSON message", e);
      return;
    }
    
    // Broadcast to all clients including sender
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(messageStr);
      }
    });
  });
  
  ws.on("error", (err) => {
    console.error("WebSocket error:", err);
  });
  
  ws.on("close", () => {
    console.log("Chat WS client disconnected");
  });
});

wss.on("error", (err) => {
  console.error("WebSocket server error:", err);
});

console.log(`Chat WS listening on ws://localhost:${CHAT_PORT}`);