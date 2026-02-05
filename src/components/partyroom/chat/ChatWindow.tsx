import { User } from "lucide-react";
import { useEffect, useRef, useState } from "react";
interface ChatMessage {
  type: "TALK" | "ENTER" | "LEAVE" | "SYSTEM";
  senderId: number;
  senderNickname: string;
  message: string;
}
interface ChatWindowProps {
  messages: string[];
  onSendMessage: (text: string) => void;
}

const USER_COLORS = [
  "text-amber-400",
  "text-blue-400",
  "text-green-400",
  "text-orange-400",
];

const ChatWindow = ({
  messages,
  onSendMessage,
  partyData,
}: ChatWindowProps) => {
  const [message, setMessage] = useState("");
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const handleKeyEnter = () => {
    if (message.trim() === "") return;
    onSendMessage(message);
    setMessage("");
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const getUsernameColor = (senderId: number) => {
    return USER_COLORS[senderId % USER_COLORS.length];
  };

  return (
    <>
      <div className="flex flex-col min-w-84 max-w-84 h-full bg-zinc-900">
        {/* 채팅 헤더 */}
        <div className="flex flex-col py-3">
          {/* 파티룸 이름, 영화 제목 */}
          <div className="text-center text-white text-base">
            {partyData?.roomName} ({partyData?.movieTitle})
          </div>
          {/* 참여 인원 */}
          <div className="flex flex-row text-white/70 items-center justify-center gap-1">
            <User className="stroke-white/40 size-4" />
            {partyData?.currentMemberCount}
          </div>
          {/* 채팅 관리 버튼 */}
          <div className="flex flex-row gap-5 justify-center px-5 py-3 text-[#816BFF] tracking-tight ">
            <button className="w-[50%] bg-zinc-800 py-1.5 text-sm cursor-pointer">
              초대 링크
            </button>
            <button className="w-[50%] bg-zinc-800 py-1.5 text-sm cursor-pointer">
              채팅 얼리기
            </button>
          </div>
        </div>
        {/* 유저 프로필 및 닉네임 */}
        <div className="flex flex-col py-3 border-b border-t border-white/10">
          <div className="text-center text-white text-sm">
            🎉 {partyData?.hostNickname}
          </div>
        </div>

        {/* 채팅 메시지 영역 */}
        <div className="flex-1 flex flex-col gap-2.5 overflow-y-auto overflow-x-hidden px-2 py-4">
          {messages.map((msg, index) => {
            // 알림 메시지
            if (msg.type !== "TALK") {
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
            const colorClass = getUsernameColor(msg.senderId);

            return (
              <div
                key={index}
                className={`w-full max-w-full px-4 rounded-sm self-start ${colorClass} text-base font-light`}
              >
                <div className="inline-block text-lg font-extrabold">
                  {msg.user} -{" "}
                </div>
                <span className="break-words">{msg.text}</span>
              </div>
            );
          })}
          <div ref={bottomRef} />
        </div>

        {/* 채팅 입력창 */}
        <div className="p-4">
          <input
            type="text"
            placeholder="채팅하기"
            className="w-full px-3 py-2 rounded bg-zinc-800 text-white text-sm placeholder:text-zinc-500 focus:outline-none border border-zinc-700"
            onKeyDown={(e) => {
              const nativeEvent = e.nativeEvent as any;
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

export default ChatWindow;
