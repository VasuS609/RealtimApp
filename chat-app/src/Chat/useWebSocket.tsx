import { useState, useRef, useCallback, useEffect } from "react"

export const useWebSocket = (url:string) =>{
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<Event | null>(null);
  const [readyState, setReadyState] = useState<WebSocket['readyState']>(WebSocket.CLOSED);
  const ws = useRef<WebSocket | null>(null);
  const sendQueue = useRef<string[]>([]);

  const send = useCallback((data: string) => {
    // If socket is open, send immediately; otherwise queue until open
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(data);
    } else {
      sendQueue.current.push(data);
    }
  }, []);

  useEffect(()=>{
    ws.current = new WebSocket(url);

    ws.current.onopen = () => {
      console.log(`connected ${url}`);
      setReadyState(ws.current!.readyState);

      // flush queued messages
      while (sendQueue.current.length > 0) {
        const msg = sendQueue.current.shift()!;
        ws.current?.send(msg);
      }
    };

    ws.current.onmessage = (event) => {
      console.log(`message received: ${event.data}`);
      setData(event.data);
    };

    ws.current.onerror = (err) => {
      setError(err as Event);
      console.log(`unexpected error occured:`, err);
    };

    ws.current.onclose = () => {
      setReadyState(ws.current?.readyState ?? WebSocket.CLOSED);
    };

    return  ()=>{
      ws.current?.close();
    };
  },[url]);

return {  send, data, error, readyState}
}

