import { VideoControls } from "./VideoControls";

interface LocalVideoCardProps {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  isJoined: boolean;
  isHost: boolean;
  isVideoEnabled: boolean;
  isAudioEnabled: boolean;
  onToggleVideo: () => void;
  onToggleAudio: () => void;
}

export const LocalVideoCard = ({
  videoRef,
  isJoined,
  isHost,
  isVideoEnabled,
  isAudioEnabled,
  onToggleVideo,
  onToggleAudio,
}: LocalVideoCardProps) => {
  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 p-4 shadow-2xl">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          📹 You {isHost && <span className="text-xs bg-blue-500 px-2 py-1 rounded">HOST</span>}
        </h3>
        {isJoined && (
          <VideoControls
            isVideoEnabled={isVideoEnabled}
            isAudioEnabled={isAudioEnabled}
            onToggleVideo={onToggleVideo}
            onToggleAudio={onToggleAudio}
          />
        )}
      </div>
      <div className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover"
        />
        {!isJoined && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900/80">
            <p className="text-gray-400">Camera off</p>
          </div>
        )}
      </div>
    </div>
  );
};
