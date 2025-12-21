# Relayer WebSocket Server

## Project Specification
- **Framework**: Socket.IO with Express and Node.js
- **Purpose**: WebSocket server for relaying signaling messages between clients
- **Port**: 8081 (configurable via .env)

## Features
- ✅ Room-based connections using Socket.IO
- ✅ WebRTC signaling (offer/answer/ICE candidates)
- ✅ CORS support
- ✅ Automatic room cleanup
- ✅ TypeScript with strict typing

## Installation
```bash
npm install
```

## Configuration
Create a `.env` file in the root directory:
```env
NODE_ENV=development
PORT=8081
```

## Running the Server

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
# Build TypeScript
npm run build

# Start server
npm start
```

## API Endpoints

### HTTP Endpoints
- `GET /health` - Health check endpoint

### Socket.IO Events

#### Client → Server
```javascript
// Join a room
socket.emit("join", { room: "room-id" });

// Send WebRTC offer
socket.emit("offer", { to: "peer-id", sdp: {...} });

// Send WebRTC answer
socket.emit("answer", { to: "peer-id", sdp: {...} });

// Send ICE candidate
socket.emit("ice-candidate", { to: "peer-id", candidate: {...} });

// Leave current room
socket.emit("leave-room");
```

#### Server → Client
```javascript
// Existing users in the room
socket.on("existing-users", ({ peers }) => {
  // peers: ["peer-id-1", "peer-id-2"]
});

// New user joined the room
socket.on("new-user", ({ peerId }) => {
  // peerId: "new-peer-id"
});

// User left the room
socket.on("user-left", ({ peerId }) => {
  // peerId: "left-peer-id"
});

// Receive WebRTC offer
socket.on("offer", ({ from, sdp }) => {
  // from: "peer-id", sdp: {...}
});

// Receive WebRTC answer
socket.on("answer", ({ from, sdp }) => {
  // from: "peer-id", sdp: {...}
});

// Receive ICE candidate
socket.on("ice-candidate", ({ from, candidate }) => {
  // from: "peer-id", candidate: {...}
});
```

## Architecture

### Room Management
- Each socket can be in one room at a time
- Rooms are automatically created when first user joins
- Rooms are automatically deleted when last user leaves
- Existing peers are notified when someone joins/leaves

### Connection Flow
1. Client connects to Socket.IO server
2. Client emits "join" event with room ID
3. Server sends "existing-users" list to the joining client
4. Server broadcasts "new-user" to other clients in the room
5. Clients establish WebRTC peer connections using signaling messages

## Testing
```bash
# Check health endpoint
curl http://localhost:8081/health

# Should return: {"status":"ok","timestamp":1234567890}
```

## Differences from demo-relayer-ws
- Uses Socket.IO instead of Elysia WebSocket
- Uses Express instead of Elysia HTTP
- Runs on Node.js instead of Bun
- No built-in rate limiting or schema validation
- Simpler, more straightforward implementation
