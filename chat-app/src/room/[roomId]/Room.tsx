import { useCallback, useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

// -------- Types --------
type RemoteStream = {
  id: string;
  stream: MediaStream;
};

const SIGNALING_SERVER_URL = "http://localhost:8081";

export default function Body() {
  const [isJoined, setIsJoined] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [remoteStreams, setRemoteStreams] = useState<RemoteStream[]>([]);

  const localStreamRef = useRef<MediaStream | null>(null);
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const socketRef = useRef<Socket | null>(null);

  // peerId -> RTCPeerConnection
  const peersRef = useRef<Map<string, RTCPeerConnection>>(new Map());
  // peerId -> RTCDataChannel
  const dataChannelsRef = useRef<Map<string, RTCDataChannel>>(new Map());

  const mediaConstraints: MediaStreamConstraints = {
    audio: true,
    video: true,
  };

  const rtcConfig: RTCConfiguration = {
    iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
  };

  // -------- Helpers --------
  const upsertRemoteStream = (id: string, stream: MediaStream) => {
    setRemoteStreams((prev) => {
      const found = prev.find((r) => r.id === id);
      if (found) {
        return prev.map((r) => (r.id === id ? { ...r, stream } : r));
      }
      return [...prev, { id, stream }];
    });
  };

  const removeRemoteStream = (id: string) => {
    setRemoteStreams((prev) => prev.filter((r) => r.id !== id));
  };

  // -------- PeerConnection Factory --------
  const createPeerConnection = useCallback(
    (peerId: string, isOfferer: boolean) => {
      // reuse if exists
      const existing = peersRef.current.get(peerId);
      if (existing) return existing;

      const pc = new RTCPeerConnection(rtcConfig);

      // add local tracks
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((track) => {
          pc.addTrack(track, localStreamRef.current!);
        });
      }

      // remote tracks
      pc.ontrack = (event) => {
        const [stream] = event.streams;
        if (stream) upsertRemoteStream(peerId, stream);
      };

      // ICE candidates
      pc.onicecandidate = (event) => {
        if (event.candidate && socketRef.current) {
          socketRef.current.emit("ice-candidate", {
            to: peerId,
            candidate: event.candidate,
          });
        }
      };

      // connection state
      pc.onconnectionstatechange = () => {
        if (pc.connectionState === "failed" || pc.connectionState === "closed") {
          pc.close();
          peersRef.current.delete(peerId);
          dataChannelsRef.current.delete(peerId);
          removeRemoteStream(peerId);
        }
      };

      // DataChannel
      if (isOfferer) {
        const dc = pc.createDataChannel("chat");
        dc.onopen = () => console.log("DC open with", peerId);
        dc.onmessage = (e) => console.log("Msg from", peerId, e.data);
        dataChannelsRef.current.set(peerId, dc);
      } else {
        pc.ondatachannel = (ev) => {
          const dc = ev.channel;
          dc.onopen = () => console.log("Incoming DC open", peerId);
          dc.onmessage = (e) => console.log("Msg from", peerId, e.data);
          dataChannelsRef.current.set(peerId, dc);
        };
      }

      peersRef.current.set(peerId, pc);
      return pc;
    },
    []
  );

  // -------- Join --------
  const handleJoin = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const stream = await navigator.mediaDevices.getUserMedia(mediaConstraints);
      localStreamRef.current = stream;
      if (localVideoRef.current) localVideoRef.current.srcObject = stream;

      const socket = io(SIGNALING_SERVER_URL, { transports: ["websocket"] });
      socketRef.current = socket;

      socket.on("connect", () => {
        // Join a named room so only those peers connect together
        socket.emit("join", { room: "default" });
      });

      // New user joined (server emits "new-user")
      socket.on("new-user", async ({ peerId }: { peerId: string }) => {
        const pc = createPeerConnection(peerId, true);
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        socket.emit("offer", { to: peerId, sdp: offer });
      });

      // Receive list of existing users and proactively offer to each
      socket.on("existing-users", async ({ peers }: { peers: string[] }) => {
        for (const peerId of peers) {
          const pc = createPeerConnection(peerId, true);
          const offer = await pc.createOffer();
          await pc.setLocalDescription(offer);
          socket.emit("offer", { to: peerId, sdp: offer });
        }
      });

      socket.on("offer", async ({ from, sdp }) => {
        const pc = createPeerConnection(from, false);
        await pc.setRemoteDescription(new RTCSessionDescription(sdp));
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        socket.emit("answer", { to: from, sdp: answer });
      });

      socket.on("answer", async ({ from, sdp }) => {
        const pc = peersRef.current.get(from);
        if (!pc) return;
        await pc.setRemoteDescription(new RTCSessionDescription(sdp));
      });

      socket.on("ice-candidate", async ({ from, candidate }) => {
        const pc = peersRef.current.get(from);
        if (!pc) return;
        await pc.addIceCandidate(new RTCIceCandidate(candidate));
      });

      socket.on("user-left", ({ peerId }: { peerId: string }) => {
        const pc = peersRef.current.get(peerId);
        if (pc) pc.close();
        peersRef.current.delete(peerId);
        dataChannelsRef.current.delete(peerId);
        removeRemoteStream(peerId);
        // No need to re-register handlers here
      });

      setIsJoined(true);
    } catch (e: any) {
      setError(e?.message || "Failed to join");
    } finally {
      setIsLoading(false);
    }
  }, [createPeerConnection]);

  // -------- Leave --------
  const handleLeave = useCallback(() => {
    localStreamRef.current?.getTracks().forEach((t) => t.stop());
    localStreamRef.current = null;
    if (localVideoRef.current) localVideoRef.current.srcObject = null;

    peersRef.current.forEach((pc) => pc.close());
    peersRef.current.clear();
    dataChannelsRef.current.clear();
    setRemoteStreams([]);

    socketRef.current?.emit("leave-room", { room: "default" });
    socketRef.current?.disconnect();
    socketRef.current = null;

    setIsJoined(false);
  }, []);

  useEffect(() => {
    return () => handleLeave();
  }, [handleLeave]);

  const broadcastData = (msg: string) => {
    dataChannelsRef.current.forEach((dc) => {
      if (dc.readyState === "open") dc.send(msg);
    });
  };

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-2">Cavlo WebRTC</h2>

      <div className="flex gap-4">
        <div>
          <div>Local</div>
          <video ref={localVideoRef} autoPlay playsInline muted width={300} />
        </div>

        <div>
          <div>Remote ({remoteStreams.length})</div>
          {remoteStreams.map((r) => (
            <video
              key={r.id}
              autoPlay
              playsInline
              ref={(el) => {
                if (el) {
                  el.srcObject = r.stream;
                }
              }}
              width={300}
            />
          ))}
        </div>
      </div>

      <div className="mt-4 flex gap-2">
        {!isJoined ? (
          <button className="border-2 px-3 py-1 rounded-2xl " onClick={handleJoin} disabled={isLoading}>
            {isLoading ? "Joining..." : "Join"}
          </button>
        ) : (
          <button className="border-2 px-3 py-1 rounded-2xl "  onClick={handleLeave}>Leave</button>
        )}

        <button onClick={() => broadcastData("Hello from peer")}>Send Data</button>
      </div>

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
