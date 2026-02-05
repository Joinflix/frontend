import { useEffect, useState } from "react";
import ChatWindow from "../components/partyroom/chat/ChatWindow";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useLocation, useParams } from "react-router";
import { useWebSocketStore } from "../store/useWebSocketStore";

const chevronStyle = "stroke-zinc-600 stroke-5";

const PartyRoomPage = () => {
  const [isChatMinimized, setIsChatMinimized] = useState(false);
  const { roomId } = useParams();
  const stompClient = useWebSocketStore((state) => state.stompClient);
  const [messages, setMessages] = useState([]);
  const location = useLocation();
  const partyData = location.state?.partyData;

  const chatWidth = 336;
  const handleWidth = 32;

  useEffect(() => {
    // /join 호출했을 때 error 나타나면 바로 연결

    if (stompClient?.connected && roomId) {
      const subscription = stompClient.subscribe(
        `/sub/party/${roomId}`,
        (message) => {
          const newMessage = JSON.parse(message.body);
          setMessages((prev) => [...prev, newMessage]);
        },
      );

      return () => {
        subscription.unsubscribe();
        console.log(`Unsubscribed from room ${roomId}`);
      };
    }
  }, [stompClient, roomId]);

  const sendChat = (text: string) => {
    if (stompClient?.connected) {
      stompClient.publish({
        destination: `/pub/party/${roomId}/talk`,
        body: JSON.stringify({ message: text }),
      });
    }
  };

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
        <ChatWindow
          messages={messages}
          onSendMessage={sendChat}
          partyData={partyData}
        />
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
