import { ChevronLeft, ChevronRight } from "lucide-react";
import { useLocation, useParams } from "react-router";
import { useRef, useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useWebSocketStore } from "../store/useWebSocketStore";
import VideoPlayer from "../components/partyroom/video/VideoPlayer";
import MicControlOverlay from "../components/partyroom/chat/MicControlOverlay";
import ChatPanel from "../components/partyroom/chat/ChatPanel";

import { useVideoSync } from "../hooks/useVideoSync";
import { usePartyChat } from "../hooks/usePartyChat";
import HostDelegationDialog from "../components/partyroom/HostDelegationDialog";
import { useRequestPartyRoomData } from "../api/queries/useRequestPartyRoomData";
import PartyClosedOverlay from "../components/partyroom/PartyClosedOverlay";
import { useLeaveParty } from "../hooks/useLeaveParty";
import ClosePartyDialog from "../components/partyroom/ClosePartyDialog";
import { useWebRTC } from "../hooks/useWebRTC";

const chatWidth = 336;
const chevronStyle = "stroke-zinc-600 stroke-5";

const PartyRoomPage = () => {
  const { partyId } = useParams();
  const location = useLocation();

  const user = useAuthStore((state) => state.user);
  const accessToken = useAuthStore((state) => state.accessToken);
  const stompClient = useWebSocketStore((state) => state.stompClient);
  const isConnected = useWebSocketStore((state) => state.isConnected);

  const [showDelegationDialog, setShowDelegationDialog] = useState(false);
  const [showClosePartyDialog, setShowClosePartyDialog] = useState(false);
  const [isPartyClosed, setIsPartyClosed] = useState(false);
  const [isMicActive, setIsMicActive] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const [isChatMinimized, setIsChatMinimized] = useState(false);

  const numericPartyId = partyId ? Number(partyId) : undefined;
  const { data: partyRoomData } = useRequestPartyRoomData(
    numericPartyId,
    location.state?.partyRoomData,
  );
  const isHost =
    partyRoomData && user
      ? String(partyRoomData.hostNickname) === String(user.nickname)
      : false;

  const handleClickOut = () => {
    if (isHost && !partyRoomData.isPublic) {
      setShowDelegationDialog(true);
    } else if (isHost && partyRoomData.isPublic) {
      setShowClosePartyDialog(true);
    } else {
      handleLeaveParty();
    }
  };

  const handleToggleMic = () => {
    if (!localStream) {
      alert("마이크를 초기화 중입니다. 잠시만 기다려주세요!");
      return;
    }

    const isNowActive = toggleLocalMic(); // 훅 내부의 함수 실행
    setIsMicActive(isNowActive);

    // 내 로컬 상태 업데이트
    setMuteStatuses((prev) => ({
      ...prev,
      [user!.userId]: !isNowActive,
    }));
  };

  // 1. 파티 연결 및 텍스트 채팅
  const { chatMessages, memberCount, sendChat, setChatMessages } = usePartyChat(
    {
      partyId: numericPartyId,
      stompClient,
      isConnected,
      accessToken,
      onPartyClosed: () => setIsPartyClosed(true),
    },
  );
  const currentMemberCount =
    memberCount ?? partyRoomData?.currentMemberCount ?? 0;

  // 2. 비디오 동기화
  useVideoSync({
    partyId: numericPartyId,
    videoRef,
    stompClient,
    isConnected,
    isHost,
    hostControl: partyRoomData?.hostControl ?? true,
    accessToken,
    setChatMessages,
    user,
  });

  // 3. Subscribe to Voice Chat
  const {
    localStream,
    toggleLocalMic,
    remoteStreams,
    muteStatuses,
    setMuteStatuses,
  } = useWebRTC({
    partyId: numericPartyId,
    stompClient,
    user,
    isMicActive,
  });

  // 4. 파티 퇴장
  const { leaveParty } = useLeaveParty({
    partyId: numericPartyId,
    stompClient,
    accessToken,
  });

  const handleLeaveParty = (newHostId?: number) => {
    setShowDelegationDialog(false);
    leaveParty(newHostId);
  };

  return (
    <div className="flex h-screen relative">
      {/* Video */}
      <VideoPlayer
        videoRef={videoRef}
        partyRoomData={partyRoomData}
        isHost={isHost}
        onClickBack={handleClickOut}
      />

      {/* Mic Control Overlay*/}
      {isChatMinimized && (
        <MicControlOverlay
          isMicActive={isMicActive}
          onToggleMic={handleToggleMic}
        />
      )}

      {/* Chat Panel*/}
      <div
        className="flex flex-col h-full bg-zinc-900 transition-all duration-300"
        style={{ width: isChatMinimized ? 0 : chatWidth }}
      >
        <ChatPanel
          user={user}
          chatMessages={chatMessages}
          onSendMessage={sendChat}
          partyRoomData={partyRoomData}
          // TODO: check if I can get count from partyRoomData
          currentMemberCount={currentMemberCount}
          isMicActive={isMicActive}
          onToggleMic={() => handleToggleMic()}
          remoteStreams={remoteStreams}
          muteStatuses={muteStatuses}
        />
      </div>

      {/* Chat Panel Handle */}
      <div
        className="absolute top-1/2 transform -translate-y-1/2 w-8 h-15 flex items-center justify-center rounded-l-lg cursor-pointer bg-zinc-900 z-20"
        onClick={() => setIsChatMinimized((prev) => !prev)}
        style={{
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

      {showDelegationDialog && (
        <HostDelegationDialog
          partyId={numericPartyId}
          onClose={() => setShowDelegationDialog(false)}
          onLeave={handleLeaveParty}
        />
      )}
      {showClosePartyDialog && (
        <ClosePartyDialog
          onClose={() => setShowClosePartyDialog(false)}
          onLeave={handleLeaveParty}
        />
      )}

      {/* Party Closed Overlay */}
      {isPartyClosed && <PartyClosedOverlay />}
    </div>
  );
};

export default PartyRoomPage;
