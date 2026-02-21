import { ChevronLeft, ChevronRight } from "lucide-react";
import { useLocation, useParams } from "react-router";
import { useRef, useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useWebSocketStore } from "../store/useWebSocketStore";
import { useRequestPartyData } from "../api/queries/useRequestPartyData";
import VideoPlayer from "../components/partyroom/video/VideoPlayer";
import MicControlOverlay from "../components/partyroom/chat/MicControlOverlay";
import ChatPanel from "../components/partyroom/chat/ChatPanel";

import { useVideoSync } from "../hooks/useVideoSync";
import { usePartyChat } from "../hooks/usePartyChat";

const chatWidth = 336;
const chevronStyle = "stroke-zinc-600 stroke-5";

const PartyRoomPage = () => {
  const { partyId } = useParams();
  const location = useLocation();

  const user = useAuthStore((state) => state.user);
  const accessToken = useAuthStore((state) => state.accessToken);
  const stompClient = useWebSocketStore((state) => state.stompClient);
  const isConnected = useWebSocketStore((state) => state.isConnected);

  const handleClickOut = () => {
    alert("click out");
  };

  const handleToggleMic = () => {
    alert("click toggle mic");
  };

  const videoRef = useRef<HTMLVideoElement>(null);
  const [isChatMinimized, setIsChatMinimized] = useState(false);

  const numericPartyId = partyId ? Number(partyId) : undefined;
  const { data: partyData } = useRequestPartyData(
    numericPartyId,
    location.state?.partyData,
  );
  const isHost =
    partyData && user
      ? String(partyData.hostNickname) === String(user.nickname)
      : false;

  const [isMicActive, setisMicActive] = useState(false);

  // 1. 파티 연결 및 텍스트 채팅
  const { chatMessages, memberCount, sendChat, setChatMessages } = usePartyChat(
    {
      partyId,
      stompClient,
      isConnected,
      accessToken,
    },
  );
  const currentMemberCount = memberCount ?? partyData?.currentMemberCount ?? 0;

  // 2. 비디오 동기화
  useVideoSync({
    partyId,
    videoRef,
    stompClient,
    isConnected,
    isHost,
    hostControl: partyData?.hostControl ?? true,
    accessToken,
    setChatMessages,
    user,
  });

  // 3. Subscribe to Voice Chat

  return (
    <div className="flex h-screen relative">
      {/* Video */}
      <VideoPlayer
        videoRef={videoRef}
        partyData={partyData}
        isHost={isHost}
        onClickBack={handleClickOut}
      />

      {/* Floating Mic Control Over Video*/}
      {isChatMinimized && (
        <MicControlOverlay
          isMicActive={isMicActive}
          onToggleMic={handleToggleMic}
        />
      )}

      {/* Chat */}
      <div
        className="flex flex-col h-full bg-zinc-900 transition-all duration-300"
        style={{ width: isChatMinimized ? 0 : chatWidth }}
      >
        <ChatPanel
          chatMessages={chatMessages}
          onSendMessage={sendChat}
          partyData={partyData}
          // TODO: check if I can get count from partyData
          currentMemberCount={currentMemberCount}
          isMicActive={isMicActive}
          onToggleMic={handleToggleMic}
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
      {/* Party Closed Overlay */}
      {/* {isPartyClosed && (
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
      )} */}

      {/* Leave Options Modal */}
      {/* {showLeaveDialog && (
        <div className="absolute inset-0 z-[110] flex items-center justify-center bg-black/80 backdrop-blur-sm px-4">
          <div className="bg-zinc-900 border border-zinc-800 w-full max-w-sm rounded-2xl p-6 shadow-2xl">
            {!isDelegating ? (
              <>
                <h3 className="text-xl font-bold text-white mb-2">
                  파티 나가기
                </h3>
                <p className="text-zinc-400 text-sm mb-6">
                  호스트 권한을 위임하거나 파티를 종료할 수 있습니다.
                </p>

                <div className="flex flex-col gap-3">
                  <button
                    onClick={handleFetchMemberList}
                    disabled={isFetchingMemberList}
                    className="w-full py-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl transition-all font-medium disabled:opacity-50"
                  >
                    {isFetchingMemberList
                      ? "로딩 중..."
                      : "권한 위임 후 나가기"}
                  </button>
                  <button
                    onClick={() => performLeave()} // No ID passed = Backend closes party
                    className="w-full py-3 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-xl transition-all font-medium border border-red-500/10"
                  >
                    파티 종료 (모두 퇴장)
                  </button>
                  <button
                    onClick={() => setShowLeaveDialog(false)}
                    className="mt-2 py-2 text-zinc-500 hover:text-zinc-300 text-sm"
                  >
                    취소
                  </button>
                </div>
              </>
            ) : (
              <>
                <h3 className="text-xl font-bold text-white mb-4">
                  새 호스트 선택
                </h3>
                <div className="max-h-60 overflow-y-auto mb-6 flex flex-col gap-2 pr-1 custom-scrollbar">
                  {!isFetchingMemberList && memberList?.length > 0 ? (
                    memberList.map((member) => (
                      <button
                        key={member.memberId}
                        onClick={() => performLeave(member.memberId)}
                        className="w-full flex items-center gap-3 p-3 rounded-xl bg-zinc-800/50 hover:bg-[#816BFF]/20 border border-transparent hover:border-[#816BFF]/50 transition-all text-left group cursor-pointer"
                      >
                        <div className="w-8 h-8 rounded-full bg-zinc-700 group-hover:bg-[#816BFF] flex items-center justify-center text-white transition-colors font-extrabold">
                          {member.memberNickname?.charAt(0)}
                        </div>
                        <span className="text-white font-medium text-sm">
                          {member.memberNickname}
                        </span>
                      </button>
                    ))
                  ) : (
                    <p className="text-zinc-500 text-center py-4 text-sm">
                      위임할 수 있는 멤버가 없습니다.
                    </p>
                  )}
                </div>
                <button
                  onClick={() => setIsDelegating(false)}
                  className="w-full py-2 text-zinc-400 hover:text-white transition-colors text-sm"
                >
                  뒤로 가기
                </button>
              </>
            )}
          </div>
        </div>
      )} */}
    </div>
  );
};

export default PartyRoomPage;
