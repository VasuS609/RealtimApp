import { RemoteStream } from "../types";

interface RemoteVideosCardProps {
  remoteStreams: RemoteStream[];
}

export const RemoteVideosCard = ({ remoteStreams }: RemoteVideosCardProps) => {
  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 p-4 shadow-2xl">
      <h3 className="text-lg font-semibold text-white mb-3">
        👥 Participants ({remoteStreams.length})
      </h3>
      <div className="grid grid-cols-1 gap-4">
        {remoteStreams.length === 0 ? (
          <div className="aspect-video bg-gray-900 rounded-lg flex items-center justify-center">
            <p className="text-gray-400">Waiting for participants...</p>
          </div>
        ) : (
          remoteStreams.map((r) => (
            <div key={r.id} className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden">
              <video
                autoPlay
                playsInline
                ref={(el) => {
                  if (el) el.srcObject = r.stream;
                }}
                className="w-full h-full object-cover"
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
};
