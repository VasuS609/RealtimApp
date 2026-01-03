interface RoomControlsProps {
  isJoined: boolean;
  isLoading: boolean;
  isHost: boolean;
  room: string;
  socketConnected: boolean;
  onRoomChange: (room: string) => void;
  onStart: () => void;
  onJoin: () => void;
  onLeave: () => void;
}

export const RoomControls = ({
  isJoined,
  isLoading,
  isHost,
  room,
  socketConnected,
  onRoomChange,
  onStart,
  onJoin,
  onLeave,
}: RoomControlsProps) => {
  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 p-6 shadow-2xl">
      <div className="flex flex-col gap-4">
        {!isJoined && (
          <div className="flex items-center gap-3">
            <label className="text-white font-medium min-w-[80px]" htmlFor="room-input">
              Room Name:
            </label>
            <input
              id="room-input"
              value={room}
              onChange={(e) => onRoomChange(e.target.value)}
              disabled={isLoading}
              className="flex-1 bg-gray-700 border border-gray-600 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              placeholder="Enter room name"
            />
          </div>
        )}

        <div className="flex gap-3 justify-center flex-wrap">
          {!isJoined ? (
            <>
              <button
                onClick={onStart}
                disabled={isLoading}
                className="bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              >
                {isLoading && isHost ? "🔄 Starting..." : "🎬 Start Room"}
              </button>
              <button
                onClick={onJoin}
                disabled={isLoading}
                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              >
                {isLoading && !isHost ? "🔄 Joining..." : "👋 Join Room"}
              </button>
            </>
          ) : (
            <>
              <button
                onClick={onLeave}
                className="bg-red-500 hover:bg-red-600 text-white font-semibold px-6 py-3 rounded-lg transition shadow-lg"
              >
                📞 Leave Call
              </button>
              {socketConnected && (
                <div className="flex items-center gap-2 bg-green-500/20 border border-green-500 text-green-200 px-4 py-3 rounded-lg">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  Connected
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
