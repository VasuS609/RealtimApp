import { useCallback, useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { RemoteStream, DEFAULT_MEDIA_CONSTRAINTS } from "./types";
import { usePeerConnection } from "./hooks/usePeerConnection";
import { useSocketHandlers } from "./hooks/useSocketHandlers";
import { LocalVideoCard } from "./components/LocalVideoCard";
import { RemoteVideosCard } from "./components/RemoteVideosCard";
import { RoomControls } from "./components/RoomControls";

const SIGNALING_SERVER_URL =
  (import.meta as any).env?.VITE_SIGNALING_URL || "http://localhost:8081";

export default function Body() {
  const [isJoined, setIsJoined] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [socketConnected, setSocketConnected] = useState(false);
  const [remoteStreams, setRemoteStreams] = useState<RemoteStream[]>([]);
  const [room, setRoom] = useState<string>(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get("room") || "default";
  });
  const [isHost, setIsHost] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);

  const localStreamRef = useRef<MediaStream | null>(null);
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const socketRef = useRef<Socket | null>(null);

  const upsertRemoteStream = useCallback((id: string, stream: MediaStream) => {
    setRemoteStreams((prev) => {
      const found = prev.find((r) => r.id === id);
      if (found) {
        return prev.map((r) => (r.id === id ? { ...r, stream } : r));
      }
      return [...prev, { id, stream }];
    });
  }, []);

  const removeRemoteStream = useCallback((id: string) => {
    setRemoteStreams((prev) => prev.filter((r) => r.id !== id));
  }, []);

  const cleanupPeer = useCallback(
    (peerId: string) => {
      const pc = peersRef.current.get(peerId);
      if (pc) {
        try {
          pc.close();
        } catch (err) {
          console.error("Error closing peer connection:", err);
        }
        peersRef.current.delete(peerId);
      }
      dataChannelsRef.current.delete(peerId);
      removeRemoteStream(peerId);
    },
    [removeRemoteStream]
  );

  const { createPeerConnection, peersRef, dataChannelsRef, cleanup: cleanupAllPeers } =
    usePeerConnection(localStreamRef, socketRef, upsertRemoteStream, cleanupPeer);

  const { setupSocketHandlers } = useSocketHandlers(
    createPeerConnection,
    peersRef,
    cleanupPeer,
    setError
  );

  const toggleVideo = useCallback(() => {
    if (localStreamRef.current) {
      const videoTrack = localStreamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoEnabled(videoTrack.enabled);
      }
    }
  }, []);

  const toggleAudio = useCallback(() => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsAudioEnabled(audioTrack.enabled);
      }
    }
  }, []);

  const handleStart = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setIsHost(true);

    const roomName = room.trim();
    if (!roomName) {
      setError("Room name is required");
      setIsLoading(false);
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia(DEFAULT_MEDIA_CONSTRAINTS);
      localStreamRef.current = stream;
      if (localVideoRef.current) localVideoRef.current.srcObject = stream;

      const socket = io(SIGNALING_SERVER_URL, {
        transports: ["websocket"],
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionAttempts: 5,
      });
      socketRef.current = socket;

      socket.on("connect", () => {
        console.log("Socket connected");
        setSocketConnected(true);
        setupSocketHandlers(socket, true, roomName);
      });

      socket.on("disconnect", () => {
        setSocketConnected(false);
      });

      setIsJoined(true);
    } catch (err: any) {
      setError(err?.message || "Failed to start");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [room, setupSocketHandlers]);

  const handleJoin = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setIsHost(false);

    const roomName = room.trim();
    if (!roomName) {
      setError("Room name is required");
      setIsLoading(false);
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia(DEFAULT_MEDIA_CONSTRAINTS);
      localStreamRef.current = stream;
      if (localVideoRef.current) localVideoRef.current.srcObject = stream;

      const socket = io(SIGNALING_SERVER_URL, {
        transports: ["websocket"],
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionAttempts: 5,
      });
      socketRef.current = socket;

      socket.on("connect", () => {
        console.log("Socket connected");
        setSocketConnected(true);
        setupSocketHandlers(socket, false, roomName);
      });

      socket.on("disconnect", () => {
        setSocketConnected(false);
      });

      setIsJoined(true);
    } catch (err: any) {
      setError(err?.message || "Failed to join");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [room, setupSocketHandlers]);

  const handleLeave = useCallback(() => {
    localStreamRef.current?.getTracks().forEach((t) => t.stop());
    localStreamRef.current = null;
    if (localVideoRef.current) localVideoRef.current.srcObject = null;

    cleanupAllPeers();
    setRemoteStreams([]);

    socketRef.current?.emit("leave-room");
    socketRef.current?.disconnect();
    socketRef.current = null;

    setIsJoined(false);
    setIsHost(false);
  }, [cleanupAllPeers]);

  useEffect(() => {
    return () => handleLeave();
  }, [handleLeave]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-white mb-6 text-center">Cavlo Video Conference</h2>
        
        {!socketConnected && isJoined && (
          <div className="bg-yellow-500/20 border border-yellow-500 text-yellow-200 px-4 py-3 rounded-lg mb-4 text-center">
            🔄 Reconnecting to server...
          </div>
        )}

        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-200 px-4 py-3 rounded-lg mb-4 text-center">
            ⚠️ {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <LocalVideoCard
            videoRef={localVideoRef}
            isJoined={isJoined}
            isHost={isHost}
            isVideoEnabled={isVideoEnabled}
            isAudioEnabled={isAudioEnabled}
            onToggleVideo={toggleVideo}
            onToggleAudio={toggleAudio}
          />

          <RemoteVideosCard remoteStreams={remoteStreams} />
        </div>

        <RoomControls
          isJoined={isJoined}
          isLoading={isLoading}
          isHost={isHost}
          room={room}
          socketConnected={socketConnected}
          onRoomChange={setRoom}
          onStart={handleStart}
          onJoin={handleJoin}
          onLeave={handleLeave}
        />
      </div>
    </div>
  );
}