import { Clock, UserRoundMinus, UserRoundPlus } from "lucide-react";

interface Props {
  status: "FRIEND" | "SENT_PENDING" | "RECEIVED_PENDING" | "NONE";
  isPending: boolean;
  onAdd: () => void;
  onRemove: () => void;
  onAccept: () => void;
}

const FriendActionButton = ({
  status,
  isPending,
  onAdd,
  onRemove,
  onAccept,
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

  if (status === "SENT_PENDING" || isPending) {
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
      <button
        onClick={onAccept}
        className={`${BASE_STYLE} bg-emerald-500/20 border-emerald-500/30 text-green-500 hover:bg-emerald-600 hover:border-non hover:text-white`}
      >
        <UserRoundPlus size={14} /> <span>수락</span>
      </button>
    );
  }

  return (
    <button
      onClick={onAdd}
      className={`${BASE_STYLE} bg-[#816BFF]/40 border-[#816BFF] text-white hover:bg-[#816BFF] hover:text-white `}
    >
      <UserRoundPlus size={14} /> <span>추가</span>
    </button>
  );
};

export default FriendActionButton;
