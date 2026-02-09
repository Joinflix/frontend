import { useEffect, useState } from "react";
import ChatWindow from "../components/partyroom/chat/ChatWindow";
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import { useLocation, useNavigate, useParams } from "react-router";
import { useWebSocketStore } from "../store/useWebSocketStore";
import { useAuthStore } from "../store/useAuthStore";

const chevronStyle = "stroke-zinc-600 stroke-5";
interface ChatMessage {
  messageType: "TALK" | "ENTER" | "LEAVE" | "SYSTEM";
  sender: string;
  message: string;
}

const PartyRoomPage = () => {
  const navigate = useNavigate();
  const [isChatMinimized, setIsChatMinimized] = useState(false);
  const { partyId } = useParams();
  const stompClient = useWebSocketStore((state) => state.stompClient);

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const location = useLocation();
  const partyData = location.state?.partyData;

  const accessToken = useAuthStore((state) => state.accessToken);
  const isConnected = useWebSocketStore((state) => state.isConnected);

  const chatWidth = 336;
  const handleWidth = 32;

  const handleClickOut = () => {
    if (stompClient?.connected) {
      stompClient.publish({
        destination: `/pub/party/${partyId}/leave`,
        headers: {
          Authorization: accessToken?.startsWith("Bearer ")
            ? accessToken
            : `Bearer ${accessToken}`,
        },
      });
    }
    navigate(-1);
  };

  useEffect(() => {
    if (!stompClient || !isConnected || !partyId) return;

    const subscription = stompClient.subscribe(
      `/sub/party/${partyId}`,
      (message) => {
        const newMessage = JSON.parse(message.body);
        setMessages((prev) => [...prev, newMessage]);
      },
    );

    // Send ENTER after subscribing
    stompClient.publish({
      destination: `/pub/party/${partyId}/enter`,
      headers: {
        Authorization: accessToken?.startsWith("Bearer ")
          ? accessToken
          : `Bearer ${accessToken}`,
      },
    });

    return () => {
      subscription.unsubscribe();

      // send LEAVE on unmount
      if (stompClient?.connected) {
        stompClient.publish({
          destination: `/pub/party/${partyId}/leave`,
          headers: {
            Authorization: accessToken?.startsWith("Bearer ")
              ? accessToken
              : `Bearer ${accessToken}`,
          },
        });
      }
    };
  }, [stompClient, isConnected, partyId, accessToken]);

  const sendChat = (text: string) => {
    if (stompClient?.connected) {
      stompClient.publish({
        destination: `/pub/party/${partyId}/talk`,
        headers: {
          Authorization: accessToken?.startsWith("Bearer ")
            ? accessToken
            : `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ message: text }),
      });
    }
  };

  return (
    <div className="flex h-screen relative">
      {/* Video */}
      <div className="flex-1 flex items-center justify-center bg-black text-white transition-all duration-300">
        <div className="absolute top-4 left-4 z-10  px-3 py-1 ">
          <div className="flex items-center gap-1">
            <ArrowLeft
              size={20}
              className="cursor-pointer top-4 left-4 z-10 hover:scale-120 transition-transform stroke-3"
              onClick={handleClickOut}
            />
            <span className="pointer-events-none">{partyData.movieTitle}</span>
          </div>
        </div>
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
