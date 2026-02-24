import { Mic, MicOff } from "lucide-react";

interface MicControlOverlayProps {
  isMicActive: boolean;
  onToggleMic: () => void;
}

const MicControlOverlay = ({
  isMicActive,
  onToggleMic,
}: MicControlOverlayProps) => {
  return (
    <div className="absolute top-6 right-6 z-30 flex flex-col items-center gap-2 group">
      <button
        onClick={onToggleMic}
        className={`
              group relative flex h-7 w-7 items-center justify-center rounded-full 
              border border-white/10 shadow-2xl transition-all duration-300 
              hover:scale-110 active:scale-95 cursor-pointer ring-4 ring-[#816BFF]/20
              ${isMicActive ? "bg-[#816BFF] text-white" : "bg-zinc-800 text-zinc-500"}
            `}
      >
        {isMicActive && (
          <div className="absolute inset-0 rounded-full animate-ping bg-[#816BFF]/40" />
        )}

        {isMicActive ? (
          <Mic className="size-4" />
        ) : (
          <MicOff className="size-4" />
        )}
      </button>

      {/* tooltip */}
      <span className="absolute top-0.5 right-9 px-2 py-1 text-xs text-white bg-black/80 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
        {isMicActive ? "클릭해서 마이크 끄기" : "클릭해서 마이크 켜기"}
      </span>
    </div>
  );
};

export default MicControlOverlay;
