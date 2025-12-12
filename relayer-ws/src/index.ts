// server.js (your existing chat server)
import { Server } from 'socket.io';
import http from 'http';

const server = http.createServer();
const io = new Server(server, {
  cors: { origin: "*" }
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // ✅ Handle CHAT
  socket.on("chat-message", (msg) => {
    socket.broadcast.emit("chat-message", msg); // send to others
  });

  // ✅ Handle WEBRTC SIGNALING
  socket.on("webrtc-offer", (data) => {
    socket.broadcast.emit("webrtc-offer", { from: socket.id, ...data });
  });

  socket.on("webrtc-answer", (data) => {
    socket.broadcast.emit("webrtc-answer", { from: socket.id, ...data });
  });

  socket.on("webrtc-ice-candidate", (data) => {
    socket.broadcast.emit("webrtc-ice-candidate", { from: socket.id, ...data });
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

server.listen(8080, () => {
  console.log("Chat + WebRTC server running on http://localhost:8080");
});