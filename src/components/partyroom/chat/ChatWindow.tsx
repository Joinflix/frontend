import { User } from "lucide-react";

const ChatWindow = () => {
  return (
    <>
      <div className="flex flex-col min-w-[21rem] bg-zinc-900">
        {/* 채팅방 이름, 인원수, 채팅방 관리 버튼 */}
        <div className="flex flex-col py-3">
          <div className="text-center text-white text-base">채팅방 이름</div>
          <div className="flex flex-row text-white/70 items-center justify-center gap-1">
            <User className="stroke-white/40 size-4" />1
          </div>
          <div className="flex flex-row gap-5 justify-center px-5 py-3 text-[#816BFF] tracking-tight text-sm">
            <button className="w-[50%] bg-zinc-800 py-1">초대 링크</button>
            <button className="w-[50%] bg-zinc-800">채팅 얼리기</button>
          </div>
        </div>
        <hr className="border-0 h-px bg-white/10" />
        {/* 유저 프로필 및 닉네임 */}
        <div className="flex flex-col py-3">
          <div className="text-center text-white text-sm">유저 닉네임</div>
        </div>
        <div className="flex flex-col justify-center items-center gap-2.5">
          {/* 알림메시지 */}
          <div className="bg-zinc-800 w-[90%] px-1 py-1.5 text-center font-extralight text-sm text-zinc-400">
            파티에 오신 것을 환영해요!
          </div>
          <div className="bg-zinc-800 w-[90%] px-1 py-1.5 text-center font-extralight text-sm text-zinc-400">
            파티에 오신 것을 환영해요!
          </div>
          <div className="bg-zinc-800 w-[90%] px-1 py-1.5 text-center font-extralight text-sm text-zinc-400">
            **님이 입장했어요
          </div>
          {/* 채팅메시지 */}
          <div className="bg-zinc-800 w-[90%] px-1 py-1.5 text-center font-extralight text-sm text-zinc-400">
            **님이 입장했어요
          </div>
        </div>

        {/* 채팅 입력창 */}
        <div></div>
      </div>
    </>
  );
};

export default ChatWindow;
