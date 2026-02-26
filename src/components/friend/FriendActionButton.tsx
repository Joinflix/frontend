import { Clock, UserRoundMinus, UserRoundPlus, UserRoundX } from "lucide-react";
import { ActionButton } from "./ActionButton";
import type { FriendStatus } from "../../types/friend";

interface Props {
  status: FriendStatus;
  onRequest: () => void;
  onRemove: () => void;
  onAccept: () => void;
  onRefuse: () => void;
}

const FriendActionButton = ({
  status,
  onRequest,
  onRemove,
  onAccept,
  onRefuse,
}: Props) => {
  const BASE_STYLE =
    "flex items-center gap-1 px-2 py-1.5 rounded-sm text-[11px] font-bold transition-all duration-300 border backdrop-blur-md active:scale-95 cursor-pointer";

  if (status === "FRIEND") {
    return (
      <button
        onClick={onRemove}
        className={`${BASE_STYLE} bg-zinc-500/10 text-zinc-400 hover:bg-red-500/20 hover:text-red-400 border-white/5`}
      >
        <UserRoundMinus size={14} /> <span>삭제</span>
      </button>
    );
  }

  if (status === "SENT_PENDING") {
    return (
      <button
        disabled
        className={`${BASE_STYLE} bg-zinc-800/50 text-zinc-500 border-white/5`}
      >
        <Clock size={14} /> <span>대기</span>
      </button>
    );
  }

  if (status === "RECEIVED_PENDING") {
    return (
      <div className="flex gap-2">
        {/* Accept Button */}
        <ActionButton
          label="수락"
          icon={UserRoundPlus}
          iconSize={14}
          variantClassName={`${BASE_STYLE} bg-emerald-500/20 border-emerald-500/30 text-emerald-500 hover:bg-emerald-600 hover:text-white transition-colors`}
          onClick={onAccept}
        />
        {/* Refuse Button */}
        <ActionButton
          label="거절"
          icon={UserRoundX}
          iconSize={14}
          variantClassName={`${BASE_STYLE}  bg-rose-500/20 border-rose-500/30 text-rose-500 hover:bg-rose-600 hover:text-white transition-colors`}
          onClick={onRefuse}
        />
      </div>
    );
  }

  return (
    <button
      onClick={onRequest}
      className={`${BASE_STYLE} bg-[#816BFF]/40 border-[#816BFF] text-white hover:bg-[#816BFF] hover:text-white `}
    >
      <UserRoundPlus size={14} /> <span>추가</span>
    </button>
  );
};

export default FriendActionButton;
