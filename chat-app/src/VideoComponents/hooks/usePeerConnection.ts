import { useCallback, useRef } from "react";
import { Socket } from "socket.io-client";
import { RemoteStream, DEFAULT_RTC_CONFIG } from "../types";

export const usePeerConnection = (
  localStreamRef: React.MutableRefObject<MediaStream | null>,
  socketRef: React.MutableRefObject<Socket | null>,
  upsertRemoteStream: (id: string, stream: MediaStream) => void,
  cleanupPeer: (peerId: string) => void
) => {
  const peersRef = useRef<Map<string, RTCPeerConnection>>(new Map());
  const dataChannelsRef = useRef<Map<string, RTCDataChannel>>(new Map());

  const createPeerConnection = useCallback(
    (peerId: string, isOfferer: boolean) => {
      if (peersRef.current.has(peerId)) {
        return peersRef.current.get(peerId)!;
      }

      const pc = new RTCPeerConnection(DEFAULT_RTC_CONFIG);

      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((track) => {
          pc.addTrack(track, localStreamRef.current!);
        });
      }

      pc.ontrack = (event) => {
        const [stream] = event.streams;
        if (stream) upsertRemoteStream(peerId, stream);
      };

      pc.onicecandidate = (event) => {
        if (event.candidate && socketRef.current) {
          socketRef.current.emit("ice-candidate", {
            to: peerId,
            candidate: event.candidate,
          });
        }
      };

      pc.onconnectionstatechange = () => {
        console.log(`Peer ${peerId} connection state:`, pc.connectionState);
        if (["failed", "closed"].includes(pc.connectionState)) {
          cleanupPeer(peerId);
        } else if (pc.connectionState === "disconnected") {
          setTimeout(() => {
            if (pc.connectionState === "disconnected") {
              cleanupPeer(peerId);
            }
          }, 5000);
        }
      };

      if (isOfferer) {
        const dc = pc.createDataChannel("chat");
        dc.onopen = () => console.log("DC open with", peerId);
        dc.onmessage = (e) => console.log("Msg from", peerId, e.data);
        dataChannelsRef.current.set(peerId, dc);
      } else {
        pc.ondatachannel = (ev) => {
          const dc = ev.channel;
          dc.onmessage = (e) => console.log("Msg from", peerId, e.data);
          dataChannelsRef.current.set(peerId, dc);
        };
      }

      peersRef.current.set(peerId, pc);
      return pc;
    },
    [localStreamRef, socketRef, upsertRemoteStream, cleanupPeer]
  );

  const cleanup = useCallback(() => {
    peersRef.current.forEach((pc) => pc.close());
    peersRef.current.clear();
    dataChannelsRef.current.clear();
  }, []);

  return {
    createPeerConnection,
    peersRef,
    dataChannelsRef,
    cleanup,
  };
};
