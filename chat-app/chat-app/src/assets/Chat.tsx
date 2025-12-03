import { useEffect, useRef, useState } from "react";
import "./index.css"

export default function Chat() {
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState<string>("");

  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    ws.current = new WebSocket("ws://localhost:8080");

    ws.current.onopen = () => {
      console.log("connected successfully");
    };

    ws.current.onmessage = (event: MessageEvent) => {
      setMessages((prev) => [...prev, event.data]);
    };

    ws.current.onclose = () => {
      console.log("disconnected");
    };

    ws.current.onerror = (e) => {
      console.log("error occurred %s", e);
    };

    return () => {
      ws.current?.close();
    };
  }, []);

  const sendMessage = () => {
    if (input.trim() !== "") {
      if (ws.current?.readyState === WebSocket.OPEN) {
        ws.current.send(input);
      } else {
        console.log("WebSocket is not open");
      }
      setInput("");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>real time chat app</h2>

      <div
      className="text-violet-700"
        style={{
          border: "1px solid black",
          height: "",
          overflowY: "scroll",
          padding: "10px",
          marginBottom: "10px",
        }}
      >
        {messages.map((msg, index) => (
          <div key={index}>{msg}</div>
        ))}
      </div>
<div className="h-30px ">


      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}

        placeholder="type a message"
      />
      <button  onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}
