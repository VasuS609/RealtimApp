import { useEffect, useState } from "react";

export default function Chat() {
  const [input, setInput] = useState<string>("");        // single string
  const [messages, setMessages] = useState<string[]>([]); // always an array

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:3000");

    ws.onmessage = async (event) => {
      let data = event.data;

      if (typeof data === "string") {
        setMessages((prev) => [...prev, data]);
      } else if (data instanceof Blob) {
        const text = await data.text();
        setMessages((prev) => [...prev, text]);
      } else if (data instanceof ArrayBuffer) {
        const text = new TextDecoder().decode(data);
        setMessages((prev) => [...prev, text]);
      }
    };


    return () => ws.close();
  }, []);

  function handleMessage() {
    if (!input.trim()) return;

    setMessages((prev) => [...prev, input]); // add message
    setInput("");                             // clear input
  }

  return (
    <div className="h-screen p-2 grid grid-rows-[1fr-auto] gap-4 bg-gray-100 dark:bg-gray-700 transition">
      {/* Chat Box */}
      <div id="chatBox" className="overflow-y-auto p-2 bg-white rounded shadow">
        {messages.map((msg, index) => (
          <p key={index} className="mb-2">{msg}</p>
        ))}
      </div>

      {/* Input Section */}
      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 p-2 rounded border"
          placeholder="Type a message..."
        />
        <button
          onClick={handleMessage}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
}
