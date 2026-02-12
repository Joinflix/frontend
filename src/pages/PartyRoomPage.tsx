import { useEffect, useRef, useState } from "react";
import ChatWindow from "../components/partyroom/chat/ChatWindow";
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import { useLocation, useNavigate, useParams } from "react-router";
import { useWebSocketStore } from "../store/useWebSocketStore";
import { useAuthStore } from "../store/useAuthStore";
import { useQuery } from "@tanstack/react-query";
import apiClient from "../api/axios";

const chevronStyle = "stroke-zinc-600 stroke-5";
interface ChatMessage {
  messageType: "TALK" | "ENTER" | "LEAVE" | "SYSTEM";
  sender: string;
  message: string;
  currentCount?: number;
}

const PartyRoomPage = () => {
  const navigate = useNavigate();
  const { partyId } = useParams();
  const location = useLocation();

  const [isChatMinimized, setIsChatMinimized] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const stompClient = useWebSocketStore((state) => state.stompClient);
  const [liveCount, setLiveCount] = useState<number | null>(null);
  const [isPartyClosed, setIsPartyClosed] = useState(false);

  const accessToken = useAuthStore((state) => state.accessToken);
  const isConnected = useWebSocketStore((state) => state.isConnected);

  const { data: queryPartyData, isPending: isPendingQueryPartyData } = useQuery(
    {
      queryKey: ["queryPartyData", partyId],
      queryFn: async () => {
        const res = await apiClient.get(`/parties/${partyId}`);
        return res.data;
      },
      enabled: !!partyId && !location.state?.partyData,
    },
  );
  const finalPartyData = location.state?.partyData || queryPartyData;

  const videoRef = useRef<HTMLVideoElement>(null);

  const isHost =
    finalPartyData?.hostId === useAuthStore((state) => state.user?.userId);
  const [isHostControl, setIsHostControl] = useState(true); // host-controlled by default
  useEffect(() => {
    if (finalPartyData) {
      setIsHostControl(finalPartyData.hostControl);
    }
  }, [finalPartyData]);

  const [videoState, setVideoState] = useState({
    currentTime: 0,
    paused: true,
  });

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
        if (newMessage.currentCount !== undefined) {
          setLiveCount(newMessage.currentCount);

          if (
            newMessage.messageType === "LEAVE" &&
            newMessage.currentCount === 0
          ) {
            setIsPartyClosed(true);
          }
        }
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
  }, [stompClient, isConnected, partyId]);

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

  const handleVideoEvent = () => {
    if (!videoRef.current) return;

    const state = {
      currentTime: videoRef.current.currentTime,
      paused: videoRef.current.paused,
    };

    // Only send if allowed
    if (isHostControl && isHost) {
      stompClient?.publish({
        destination: `/pub/party/${partyId}/video`,
        body: JSON.stringify(state),
        headers: {
          Authorization: accessToken?.startsWith("Bearer ")
            ? accessToken
            : `Bearer ${accessToken}`,
        },
      });
    } else if (!isHostControl) {
      // everyone can control
      stompClient?.publish({
        destination: `/pub/party/${partyId}/video`,
        body: JSON.stringify(state),
        headers: {
          Authorization: accessToken?.startsWith("Bearer ")
            ? accessToken
            : `Bearer ${accessToken}`,
        },
      });
    }
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.addEventListener("play", handleVideoEvent);
    video.addEventListener("pause", handleVideoEvent);
    video.addEventListener("seeked", handleVideoEvent);

    return () => {
      video.removeEventListener("play", handleVideoEvent);
      video.removeEventListener("pause", handleVideoEvent);
      video.removeEventListener("seeked", handleVideoEvent);
    };
  }, [isHostControl, isHost]);

  useEffect(() => {
    if (!stompClient || !isConnected || !partyId) return;

    const sub = stompClient.subscribe(`/sub/party/${partyId}/video`, (msg) => {
      const { currentTime, paused } = JSON.parse(msg.body);

      if (isHostControl && !isHost) {
        // Only sync if not host in host-controlled mode
        if (videoRef.current) {
          videoRef.current.currentTime = currentTime;
          if (paused) videoRef.current.pause();
          else videoRef.current.play();
        }
      } else if (!isHostControl) {
        // Everyone sync
        if (videoRef.current) {
          videoRef.current.currentTime = currentTime;
          if (paused) videoRef.current.pause();
          else videoRef.current.play();
        }
      }
    });

    return () => sub.unsubscribe();
  }, [stompClient, partyId, isHostControl, isHost, isConnected]);

  const displayCount = liveCount ?? finalPartyData?.currentMemberCount ?? 0;

  // Place this right before your main return
  if (isPendingQueryPartyData && !finalPartyData) {
    return (
      <div className="h-screen w-full bg-black flex flex-col items-center justify-center text-white gap-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#816BFF]"></div>
        <p className="animate-pulse text-zinc-400">
          파티룸 정보를 가져오는 중...
        </p>
      </div>
    );
  }

  // Second safety guard: if data fails to load or doesn't exist
  if (!finalPartyData) {
    return (
      <div className="h-screen w-full bg-black flex items-center justify-center text-white">
        <p>파티를 찾을 수 없습니다.</p>
        <button onClick={() => navigate(-1)} className="ml-4 underline">
          돌아가기
        </button>
      </div>
    );
  }

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
            <span className="pointer-events-none">
              {finalPartyData.movieTitle}
            </span>
          </div>
        </div>
        <video
          ref={videoRef}
          src="/public/videos/steamboat-willie_1928.mp4"
          className="object-contain w-full h-full max-h-screen max-w-screen"
          controls={!isHostControl || isHost} // host-only controls if hostControl mode
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
          partyData={finalPartyData}
          currentCount={displayCount}
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
      {/* Party Closed Overlay */}
      {isPartyClosed && (
        <div className="absolute inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md">
          <div className="text-center p-8 bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl">
            <h2 className="text-2xl font-bold text-white mb-2">
              방장이 파티를 종료했습니다.
            </h2>
            <p className="text-zinc-400 mb-6">the host has closed this party</p>
            <button
              onClick={() => navigate("/party", { replace: true })}
              className="px-6 py-2 bg-[#816BFF] text-white rounded-lg font-medium hover:bg-[#6c56e0] transition-colors cursor-pointer"
            >
              목록으로 돌아가기
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PartyRoomPage;
