import {
  ChevronDown,
  ChevronUp,
  Crown,
  Mic,
  MicOff,
  User as UserIcon,
  Volume2,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import type { PartyRoomData } from "../../../types/party";
import type { ChatStompMessage } from "../../../types/chat";
import RemoteAudio from "./RemoteAudio";
import type { User } from "../../../store/useAuthStore";
import { usePartyMembers } from "../../../api/queries/usePartyMembers";

interface ChatWindowProps {
  // GENERAL
  user: User | null;
  partyRoomData: PartyRoomData;
  currentMemberCount: number;
  // TEXT CHAT
  chatMessages: ChatStompMessage[];
  onSendMessage: (text: string) => void;
  // VOICE CHAT
  isMicActive: boolean;
  onToggleMic: () => void;
  remoteStreams: { [userId: number]: MediaStream };
  muteStatuses: { [userId: number]: boolean };
}

const USER_COLORS = [
  "text-blue-400",
  "text-green-400",
  "text-amber-400",
  "text-orange-400",
  "text-rose-400",
  "text-purple-400",
  "text-cyan-400",
  "text-lime-400",
  "text-indigo-400",
  "text-pink-400",
];

const ChatPanel = ({
  // GENERAL
  user,
  partyRoomData,
  currentMemberCount,
  // TEXT CHAT
  chatMessages,
  onSendMessage,
  // VOICE CHAT
  isMicActive,
  onToggleMic,
  remoteStreams,
  muteStatuses,
}: ChatWindowProps) => {
  const [message, setMessage] = useState("");
  const [isVoiceControlOpen, setIsVoiceControlOpen] = useState(true);
  const [volumes, setVolumes] = useState<{ [userId: number]: number }>({});
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const {
    data: memberList,
    isFetching: isFetchingMemberList,
    refetch: fetchMemberList,
  } = usePartyMembers(partyRoomData.id);

  const memberMap = useMemo(() => {
    const map: Record<number, { nickname: string; color: string }> = {};

    if (!memberList || !Array.isArray(memberList)) return map;

    memberList.forEach((member: any, index: number) => {
      const id = member.memberId;
      const nickname = member.memberNickname;

      map[id] = {
        nickname: nickname,
        color: USER_COLORS[index % USER_COLORS.length],
      };
    });

    return map;
  }, [memberList]);

  // Initialize volume for new streams if not already set
  useEffect(() => {
    Object.keys(remoteStreams).forEach((id) => {
      const userId = Number(id);
      if (volumes[userId] === undefined) {
        setVolumes((prev) => ({ ...prev, [userId]: 0.5 })); // Default 50%
      }
    });
  }, [remoteStreams]);

  const handleKeyEnter = () => {
    if (message.trim() === "") return;
    onSendMessage(message);
    setMessage("");
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  return (
    <>
      <div className="flex flex-col min-w-84 max-w-84 bg-zinc-900">
        {/* 채팅 헤더 */}
        <div className="flex flex-col pt-3">
          <div className="flex justify-between gap-3 px-4">
            {/* 파티룸 이름, 영화 제목 */}
            <div className="text-center text-white text-base">
              {partyRoomData?.roomName}
            </div>
            {/* 참여 인원 */}
            <div className="flex flex-row text-zinc-400/70 items-center justify-center gap-1 text-sm">
              <UserIcon className="stroke-zinc-400/70 size-4 stroke-2.5" />
              {currentMemberCount} / 4
            </div>
          </div>

          <div className="flex flex-col py-3 px-3 border-b border-white/10">
            {/* Host Display */}
            <div className="flex items-center gap-2 p-2 bg-zinc-800/30 rounded-lg border border-white/5">
              <div className="w-6 h-6 rounded-full bg-amber-500/20 flex items-center justify-center ml-1">
                <Crown size={14} className="text-amber-500" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-md text-white font-medium truncate">
                  {partyRoomData?.hostNickname}
                </p>
              </div>
              <div className="text-white text-xs mr-2">
                {partyRoomData.hostControl ? "호스트만 컨트롤" : "모두 컨트롤"}
              </div>
            </div>
          </div>
        </div>

        {/* 2. Voice Members Area (Individual Volume Controls) */}
        <div className="flex flex-col shrink-0 max-h-56 overflow-hidden bg-transparent border-b border-white/5 transition-colors duration-200 hover:bg-white/5 py-3">
          {/* Header - The clickable area */}
          <div
            className="px-4 py-2 flex items-center justify-between cursor-pointer"
            onClick={() => setIsVoiceControlOpen(!isVoiceControlOpen)}
          >
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                voice control
              </span>
              {/* Toggle Icon */}
              {isVoiceControlOpen ? (
                <ChevronUp size={12} className="text-zinc-500" />
              ) : (
                <ChevronDown size={12} className="text-zinc-500" />
              )}
            </div>

            {/* {(() => {
              const activeCount =
                Object.keys(remoteStreams).length + (isMicActive ? 1 : 0);
              const isMultiple = activeCount >= 1;

              return (
                <span
                  className={`text-[10px] font-medium ${isMultiple ? "text-[#816BFF]" : "text-zinc-400"}`}
                >
                  {activeCount} / 4 active
                </span>
              );
            })()} */}
          </div>

          {/* Foldable Content */}
          {isVoiceControlOpen && (
            <div className="overflow-y-auto px-3 pb-3 space-y-2 scrollbar-hidden">
              <div
                className={`flex flex-col gap-1 p-2 px-2 border rounded-lg ${isMicActive ? "bg-[#816BFF]/10 border-1.5 border-[#816BFF]/30" : "bg-zinc-400/10 border-zinc-400/30"} `}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs font-semibold ${isMicActive ? "text-[#816BFF]" : "text-zinc-400/70"}`}
                    >
                      {user?.nickname} (나)
                    </span>
                    {/* <VoiceVisualizer stream={localStream} /> */}
                  </div>

                  <div className="flex items-center gap-1">
                    <div
                      className={`text-[10px] ${isMicActive ? "text-[#816BFF]" : "text-zinc-400/70"}`}
                    >
                      내 마이크 {isMicActive ? "켜짐" : "꺼짐"}
                    </div>
                    {isMicActive ? (
                      <Mic size={14} className="text-[#816BFF] " />
                    ) : (
                      <MicOff size={14} className="text-zinc-400/70" />
                    )}
                  </div>
                </div>
              </div>

              {/* Remote Users */}
              {Object.entries(remoteStreams).map(([id, stream]) => {
                const userId = Number(id);
                const isMuted = muteStatuses[userId];
                const volume = volumes[userId] ?? 0.5; //default 50%

                console.log({ memberList });

                const memberInfo = memberMap[userId];
                console.log({ memberInfo });
                const displayName = memberInfo?.nickname || `User ${userId}`;
                const nicknameColor = memberInfo?.color || "text-[#816BFF]";

                return (
                  <div
                    key={userId}
                    className={`flex flex-col gap-2 p-2  rounded-lg border border-white/5 group transition-all hover:border-[#816BFF]/30 ${isMuted ? "bg-zinc-800/60" : "bg-[#816BFF]/10"}`}
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-xs font-semibold truncate pr-2 ${isMuted ? "text-zinc-400/70" : nicknameColor}`}
                      >
                        {displayName}
                      </span>
                      <div className="flex items-center gap-1">
                        <span
                          className={`text-[10px] ${isMuted ? "text-zinc-400/70" : "text-[#816BFF]"}`}
                        >
                          상대 마이크 {isMuted ? "꺼짐" : "켜짐"}
                        </span>
                        {isMuted ? (
                          <MicOff size={14} className="text-zinc-400/70" />
                        ) : (
                          <Mic size={14} className="text-[#816BFF]" />
                        )}
                      </div>
                    </div>
                    {/* This component handles the actual audio logic */}
                    <RemoteAudio
                      stream={stream}
                      volume={isMuted ? 0 : volume}
                    />

                    {/* Volume Slider */}
                    <div className="flex items-center gap-2 opacity-40 group-hover:opacity-100 transition-opacity">
                      <Volume2 size={12} className="text-zinc-400 shrink-0" />
                      <input
                        disabled={isMuted}
                        type="range"
                        min="0"
                        max="1"
                        step="0.05"
                        value={volume}
                        onChange={(e) => {
                          const newVol = parseFloat(e.target.value);
                          setVolumes((prev) => ({ ...prev, [userId]: newVol }));
                        }}
                        className="flex-1 h-1 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-[#816BFF]"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* 채팅 메시지 영역 */}
      <div className="flex-1 flex flex-col gap-2.5 overflow-y-auto overflow-x-hidden scrollbar-hidden px-2 py-4">
        {chatMessages.map((msg, index) => {
          // 알림 메시지
          if (msg.messageType !== "TALK") {
            return (
              <div
                key={index}
                className="bg-zinc-800 w-[90%] px-2 py-1.5 text-zinc-400 rounded-sm self-center font-extralight text-center text-sm"
              >
                {msg.message}
              </div>
            );
          }

          // 채팅 메시지
          const senderColor = memberMap[msg.senderId]?.color || "text-white";
          return (
            <div
              key={index}
              className={`w-full max-w-full px-4 rounded-sm self-start ${senderColor} text-base font-light`}
            >
              <div className="inline-block text-lg font-extrabold">
                {msg.senderNickname}
              </div>
              <span className="break-all ml-3">{msg.message}</span>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* 채팅 입력창 */}
      <div className="p-4">
        <div className="flex items-center gap-2 bg-zinc-800 rounded-full border border-zinc-700 pl-1 pr-2 focus-within:border-[#816BFF]/50 transition-all">
          <div className="relative group">
            {/* Voice Toggle */}
            <button
              onClick={onToggleMic}
              className={`relative flex items-center justify-center p-1.5 rounded-full shadow-2xl transition-all duration-300 cursor-pointer active:scale-95 hover:scale-110 ${
                isMicActive
                  ? "border-white/10 bg-[#816BFF]/70 ring-2 ring-[#816BFF]/20"
                  : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-700"
              }`}
            >
              {isMicActive ? (
                <>
                  <div className="absolute inset-0 rounded-full animate-ping bg-[#816BFF]/40 pointer-events-none" />
                  <Mic
                    size={18}
                    className="relative z-10 stroke-2 text-white"
                  />
                </>
              ) : (
                <MicOff size={18} />
              )}
            </button>
          </div>

          <input
            type="text"
            placeholder="채팅하기"
            className="w-full pr-3 py-2 rounded-l-none rounded-r-full bg-zinc-800 text-white text-sm placeholder:text-zinc-500 focus:outline-none"
            onKeyDown={(e) => {
              const nativeEvent = e.nativeEvent as KeyboardEvent;
              if (nativeEvent.isComposing) return;
              if (e.key === "Enter") {
                e.preventDefault();
                handleKeyEnter();
              }
            }}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>
      </div>
    </>
  );
};

export default ChatPanel;
