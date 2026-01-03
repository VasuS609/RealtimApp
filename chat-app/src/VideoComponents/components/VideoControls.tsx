interface VideoControlsProps {
  isVideoEnabled: boolean;
  isAudioEnabled: boolean;
  onToggleVideo: () => void;
  onToggleAudio: () => void;
}

export const VideoControls = ({
  isVideoEnabled,
  isAudioEnabled,
  onToggleVideo,
  onToggleAudio,
}: VideoControlsProps) => {
  return (
    <div className="flex gap-2">
      <button
        onClick={onToggleVideo}
        className={`px-3 py-1 rounded-lg transition ${
          isVideoEnabled
            ? "bg-blue-500 hover:bg-blue-600 text-white"
            : "bg-red-500 hover:bg-red-600 text-white"
        }`}
      >
        {isVideoEnabled ? "📹" : "📹❌"}
      </button>
      <button
        onClick={onToggleAudio}
        className={`px-3 py-1 rounded-lg transition ${
          isAudioEnabled
            ? "bg-blue-500 hover:bg-blue-600 text-white"
            : "bg-red-500 hover:bg-red-600 text-white"
        }`}
      >
        {isAudioEnabled ? "🎤" : "🎤❌"}
      </button>
    </div>
  );
};
