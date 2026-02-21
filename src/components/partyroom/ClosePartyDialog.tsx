interface ClosePartyDialogProps {
  onClose: () => void;
  onLeave: (newHostId?: number) => void;
}

const ClosePartyDialog = ({ onClose, onLeave }: ClosePartyDialogProps) => {
  return (
    <div className="absolute inset-0 z-110 flex items-center justify-center bg-black/80 backdrop-blur-sm px-4">
      <div className="bg-zinc-900 border border-zinc-800 w-full max-w-sm rounded-2xl p-6 shadow-2xl">
        <>
          <h3 className="text-xl font-bold text-white mb-2">파티 나가기</h3>
          <p className="text-zinc-400 text-sm mb-6">
            파티를 종료할 수 있습니다.
          </p>

          <div className="flex flex-col gap-3">
            <button
              onClick={() => onLeave()}
              className="w-full py-3 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-xl transition-all font-medium border border-red-500/10"
            >
              파티 종료 (모두 퇴장)
            </button>
            <button
              onClick={onClose}
              className="mt-2 py-2 text-zinc-500 hover:text-zinc-300 text-sm"
            >
              취소
            </button>
          </div>
        </>
      </div>
    </div>
  );
};

export default ClosePartyDialog;
