import { useState, useRef, useCallback, useEffect } from "react"

const MAX_RETRIES = 5;
const INITIAL_RETRY_DELAY = 1000;

export const useWebSocket = (url: string) => {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<Event | null>(null);
  const [readyState, setReadyState] = useState<WebSocket['readyState']>(WebSocket.CLOSED);
  const [isConnecting, setIsConnecting] = useState(false);
  
  const ws = useRef<WebSocket | null>(null);
  const sendQueue = useRef<string[]>([]);
  const retryCount = useRef(0);
  const retryTimeout = useRef<NodeJS.Timeout | null>(null);
  const shouldReconnect = useRef(true);

  const connect = useCallback(() => {
    if (ws.current?.readyState === WebSocket.OPEN || 
        ws.current?.readyState === WebSocket.CONNECTING) {
      return;
    }

    setIsConnecting(true);
    ws.current = new WebSocket(url);

    ws.current.onopen = () => {
      console.log(`Connected to ${url}`);
      setReadyState(WebSocket.OPEN);
      setIsConnecting(false);
      retryCount.current = 0;

      // Flush queued messages
      while (sendQueue.current.length > 0) {
        const msg = sendQueue.current.shift()!;
        ws.current?.send(msg);
      }
    };

    ws.current.onmessage = (event) => {
      try {
        console.log("WebSocket received:", event.data, typeof event.data);
        setData(event.data);
      } catch (err) {
        console.error("Error processing message:", err);
      }
    };

    ws.current.onerror = (err) => {
      setError(err as Event);
      console.error("WebSocket error:", err);
    };

    ws.current.onclose = (event) => {
      setReadyState(WebSocket.CLOSED);
      setIsConnecting(false);
      console.log("WebSocket closed:", event.code, event.reason);

      // Attempt reconnection with exponential backoff
      if (shouldReconnect.current && retryCount.current < MAX_RETRIES) {
        const delay = INITIAL_RETRY_DELAY * Math.pow(2, retryCount.current);
        console.log(`Reconnecting in ${delay}ms... (attempt ${retryCount.current + 1}/${MAX_RETRIES})`);
        
        retryTimeout.current = setTimeout(() => {
          retryCount.current++;
          connect();
        }, delay);
      }
    };
  }, [url]);

  const send = useCallback((data: string) => {
    // Validate message size
    if (data.length > 10240) {
      console.error("Message too large (>10KB)");
      return;
    }

    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(data);
    } else {
      sendQueue.current.push(data);
    }
  }, []);

  const disconnect = useCallback(() => {
    shouldReconnect.current = false;
    if (retryTimeout.current) {
      clearTimeout(retryTimeout.current);
      retryTimeout.current = null;
    }
    ws.current?.close();
    ws.current = null;
  }, []);

  useEffect(() => {
    connect();

    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  return { send, data, error, readyState, isConnecting, disconnect };
}

