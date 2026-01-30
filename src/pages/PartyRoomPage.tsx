import { useState } from "react";
import ChatWindow from "../components/partyroom/chat/ChatWindow";
import { ChevronLeft, ChevronRight } from "lucide-react";

const chevronStyle = "stroke-zinc-600 stroke-5";

const PartyRoomPage = () => {
  const [isChatMinimized, setIsChatMinimized] = useState(false);

  const chatWidth = 336;
  const handleWidth = 32;

  return (
    <div className="flex h-screen relative">
      {/* Video */}
      <div className="flex-1 flex items-center justify-center bg-black text-white transition-all duration-300">
        <video
          src="/public/videos/steamboat-willie_1928.mp4"
          className="object-contain w-full h-full max-h-screen max-w-screen"
          controls
        />
      </div>

      {/* Chat */}
      <div
        className="flex flex-col h-full bg-zinc-900 transition-all duration-300"
        style={{ width: isChatMinimized ? 0 : chatWidth }}
      >
        <ChatWindow />
      </div>

      {/* Handle */}
      <div
        className="absolute top-1/2 transform -translate-y-1/2 w-8 h-15 flex items-center justify-center rounded-l-lg cursor-pointer bg-zinc-900 z-20"
        onClick={() => setIsChatMinimized((prev) => !prev)}
        style={{
          // Move handle: right edge of chat if expanded, right screen edge if minimized
          right: isChatMinimized ? 0 : chatWidth,
          transition: "right 0.3s",
        }}
      >
        {isChatMinimized ? (
          <ChevronLeft className={chevronStyle} />
        ) : (
          <ChevronRight className={chevronStyle} />
        )}
      </div>
    </div>
  );
};

export default PartyRoomPage;
