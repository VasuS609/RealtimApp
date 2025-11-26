import {WebSocketServer} from 'ws';
import http from "http";

const server = http.createServer();
const wss = new WebSocketServer({server});

wss.on('connection', (ws)=>{
  console.log("user connected");
  ws.send('connected');

  ws.on('message', (data)=>{
    wss.clients.forEach((client)=>{
      if(client.readyState == ws.OPEN){
        client.send(data.toString());
      }
    })

    ws.on('close', ()=>{
      console.log("client disconnected");
      ws.send("user disconnected")
    })
  })
})

server.listen(8080, ()=>{
  console.log("srver is running on port 8080");
})