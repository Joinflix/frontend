import {
  ChevronDown,
  ChevronUp,
  Crown,
  Mic,
  MicOff,
  User as UserIcon,
  Volume2,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { PartyRoomData } from "../../../types/party";
import type { ChatStompMessage } from "../../../types/chat";
import RemoteAudio from "./RemoteAudio";
import type { User } from "../store/useAuthStore";

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
  console.log("Count of streams:", Object.keys(remoteStreams).length);

  const [message, setMessage] = useState("");
  const [isVoiceControlOpen, setIsVoiceControlOpen] = useState(true);
  const [volumes, setVolumes] = useState<{ [userId: number]: number }>({});
  const bottomRef = useRef<HTMLDivElement | null>(null);

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

  // 닉네임을 기반으로 고유한 색상 클래스를 반환하는 함수
  const getUsernameColor = (nickname: string) => {
    if (!nickname) return USER_COLORS[0];

    // 1. 문자열을 숫자로 변환 (Hash)
    let hash = 0;
    for (let i = 0; i < nickname.length; i++) {
      hash = nickname.charCodeAt(i) + ((hash << 5) - hash);
    }

    // 2. 숫자를 색상 배열의 길이로 나눈 나머지값으로 인덱스 결정
    const index = Math.abs(hash) % USER_COLORS.length;
    return USER_COLORS[index];
  };

  return (
    <>
      <div className="flex flex-col min-w-84 max-w-84 bg-zinc-900">
        {/* 채팅 헤더 */}
        <div className="flex flex-col pt-3">
          {/* 파티룸 이름, 영화 제목 */}
          <div className="text-center text-white text-base">
            {partyRoomData?.roomName}
          </div>
          {/* 참여 인원 */}
          <div className="flex flex-row text-white/70 items-center justify-center gap-1">
            <UserIcon className="stroke-white/40 size-4" />
            {currentMemberCount} / 4
          </div>

          <div className="flex flex-col py-3 px-3 border-b border-white/10">
            {/* Host Display */}
            <div className="flex items-center gap-3 p-2 bg-zinc-800/30 rounded-lg border border-white/5">
              <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center">
                <Crown size={14} className="text-amber-500" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-white font-medium truncate">
                  {partyRoomData?.hostNickname}
                </p>
                <p className="text-[10px] text-zinc-500">Party Host</p>
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

            <span className="text-[10px] text-[#816BFF] font-medium">
              {Object.keys(remoteStreams).length + (isMicActive ? 1 : 0)} / 4
              active
            </span>
          </div>

          {/* Foldable Content */}
          {isVoiceControlOpen && (
            <div className="overflow-y-auto px-3 pb-3 space-y-2 custom-scrollbar">
              <div className="flex flex-col gap-1 p-2 px-2 bg-[#816BFF]/10 rounded-lg border border-[#816BFF]/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-white font-semibold">
                      나(`${user.nickname}`)
                    </span>
                    {/* <VoiceVisualizer stream={localStream} /> */}
                  </div>
                  <Mic size={14} className="text-[#816BFF] animate-pulse" />
                </div>
                <div className="text-[10px] text-[#816BFF]/70">마이크 켜짐</div>
              </div>

              {/* Remote Users */}
              {Object.entries(remoteStreams).map(([id, stream]) => {
                const userId = Number(id);
                const isMuted = muteStatuses[userId];
                const volume = volumes[userId] ?? 0.5; //default 50%

                return (
                  <div
                    key={userId}
                    className="flex flex-col gap-2 p-2 bg-zinc-800/60 rounded-lg border border-white/5 group transition-all hover:border-[#816BFF]/30"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-zinc-200 font-medium truncate pr-2">
                        User {userId}{" "}
                        {/* You can map this to a nickname if you pass a member list */}
                      </span>
                      {isMuted ? (
                        <MicOff size={14} className="text-red-500/70" />
                      ) : (
                        <Mic
                          size={14}
                          className="text-[#816BFF] animate-pulse"
                        />
                      )}
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
      <div className="flex-1 flex flex-col gap-2.5 overflow-y-auto overflow-x-hidden px-2 py-4">
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
          const colorClass = getUsernameColor(msg.senderNickname);

          return (
            <div
              key={index}
              className={`w-full max-w-full px-4 rounded-sm self-start ${colorClass} text-base font-light`}
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
