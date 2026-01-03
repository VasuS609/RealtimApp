import { useCallback } from "react";
import { Socket } from "socket.io-client";

export const useSocketHandlers = (
  createPeerConnection: (peerId: string, isOfferer: boolean) => RTCPeerConnection,
  peersRef: React.MutableRefObject<Map<string, RTCPeerConnection>>,
  cleanupPeer: (peerId: string) => void,
  setError: (error: string | null) => void
) => {
  const setupSocketHandlers = useCallback(
    (socket: Socket, amHost: boolean, roomName: string) => {
      const resolvedRoom = roomName || "default";

      socket.removeAllListeners();
      socket.emit("join", { room: resolvedRoom, isHost: amHost });

      socket.on("error", (error: any) => {
        console.error("Socket error:", error);
        setError(error.message || "Socket connection error");
      });

      socket.on("disconnect", (reason) => {
        console.log("Socket disconnected:", reason);
        setError("Disconnected from server");
      });

      if (amHost) {
        socket.on("new-user", async ({ peerId }: { peerId: string }) => {
          try {
            const pc = createPeerConnection(peerId, true);
            const offer = await pc.createOffer();
            await pc.setLocalDescription(offer);
            socket.emit("offer", { to: peerId, sdp: offer });
          } catch (err) {
            console.error("Error creating offer:", err);
          }
        });
      }

      if (!amHost) {
        socket.on("existing-users", ({ peers }: { peers: string[] }) => {
          console.log("Existing peers:", peers);
        });
      }

      socket.on("offer", async ({ from, sdp }) => {
        if (peersRef.current.has(from)) {
          console.warn(`PC already exists for ${from}, ignoring offer`);
          return;
        }
        const pc = createPeerConnection(from, false);
        try {
          await pc.setRemoteDescription(new RTCSessionDescription(sdp));
          const answer = await pc.createAnswer();
          await pc.setLocalDescription(answer);
          socket.emit("answer", { to: from, sdp: answer });
        } catch (err) {
          console.error("Error handling offer:", err);
          setError("Failed to establish connection");
        }
      });

      socket.on("answer", async ({ from, sdp }) => {
        const pc = peersRef.current.get(from);
        if (!pc) {
          console.warn("No PC for answer from", from);
          return;
        }
        if (pc.signalingState !== "have-local-offer") {
          console.warn(`Ignoring answer: signaling state is ${pc.signalingState}`);
          return;
        }
        try {
          await pc.setRemoteDescription(new RTCSessionDescription(sdp));
        } catch (err) {
          console.error("Failed to set remote answer", err);
        }
      });

      socket.on("ice-candidate", async ({ from, candidate }) => {
        const pc = peersRef.current.get(from);
        if (pc && pc.remoteDescription) {
          try {
            await pc.addIceCandidate(new RTCIceCandidate(candidate));
          } catch (err) {
            console.error("Error adding ICE candidate", err);
          }
        }
      });

      socket.on("user-left", ({ peerId }: { peerId: string }) => {
        cleanupPeer(peerId);
      });
    },
    [createPeerConnection, peersRef, cleanupPeer, setError]
  );

  return { setupSocketHandlers };
};
