export interface RemoteStream {
  id: string;
  stream: MediaStream;
}

export interface PeerConnectionConfig {
  iceServers: RTCIceServer[];
}

export const DEFAULT_RTC_CONFIG: RTCConfiguration = {
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
};

export const DEFAULT_MEDIA_CONSTRAINTS: MediaStreamConstraints = {
  audio: true,
  video: true,
};
