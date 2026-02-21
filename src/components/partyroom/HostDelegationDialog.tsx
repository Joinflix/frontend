import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import apiClient from "../../api/axios";

//MemberResponse(BE)
interface Member {
  memberId: number;
  memberNickname: string;
}

interface HostDelegationDialogProps {
  partyId: number | undefined;
  onClose: () => void;
  onLeave: (newHostId?: number) => void;
}

const HostDelegationDialog = ({
  partyId,
  onClose,
  onLeave,
}: HostDelegationDialogProps) => {
  const [isDelegating, setIsDelegating] = useState(false);

  const {
    data: memberList,
    isFetching: isFetchingMemberList,
    refetch: fetchMemberList,
  } = useQuery({
    queryKey: ["memberList"],
    queryFn: async () => {
      const res = await apiClient.get(`/parties/${partyId}/members`);
      return res.data;
    },
    enabled: false,
  });

  const handleFetchMemberList = async () => {
    await fetchMemberList();
    setIsDelegating(true);
  };

  return (
    <div className="absolute inset-0 z-110 flex items-center justify-center bg-black/80 backdrop-blur-sm px-4">
      <div className="bg-zinc-900 border border-zinc-800 w-full max-w-sm rounded-2xl p-6 shadow-2xl">
        {!isDelegating ? (
          <>
            <h3 className="text-xl font-bold text-white mb-2">파티 나가기</h3>
            <p className="text-zinc-400 text-sm mb-6">
              호스트 권한을 위임하거나 파티를 종료할 수 있습니다.
            </p>

            <div className="flex flex-col gap-3">
              <button
                onClick={handleFetchMemberList}
                disabled={isFetchingMemberList}
                className="w-full py-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl transition-all font-medium disabled:opacity-50"
              >
                {isFetchingMemberList ? "로딩 중..." : "권한 위임 후 나가기"}
              </button>
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
        ) : (
          <>
            <h3 className="text-xl font-bold text-white mb-4">
              새 호스트 선택
            </h3>
            <div className="max-h-60 overflow-y-auto mb-6 flex flex-col gap-2 pr-1 custom-scrollbar">
              {!isFetchingMemberList && memberList?.length > 0 ? (
                memberList.map((member: Member) => (
                  <button
                    key={member.memberId}
                    onClick={() => onLeave(member.memberId)}
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
  );
};

export default HostDelegationDialog;
