import { useState, useRef, useEffect } from "react";
import { X, UserPlus, UserCheck, Clock, Users, Trash2 } from "lucide-react";
import {
  useFriends,
  useIncomingRequests,
  useOutgoingRequests,
  useAllUsers,
  useSendFriendRequest,
  useAcceptRequest,
  useRejectRequest,
  useCancelRequest,
  useDeleteFriend,
  type Friend,
  type FriendRequest,
  type User,
} from "../../api/queries/useFriendQueries";

interface FriendModalProps {
  onClose: () => void;
}

type TabType = "friends" | "incoming" | "outgoing" | "users";

const FriendModal = ({ onClose }: FriendModalProps) => {
  const [activeTab, setActiveTab] = useState<TabType>("friends");
  const modalRef = useRef<HTMLDivElement>(null);

  // API Hooks
  const { data: friends = [], isLoading: friendsLoading } = useFriends();
  const { data: incoming = [], isLoading: incomingLoading } =
    useIncomingRequests();
  const { data: outgoing = [], isLoading: outgoingLoading } =
    useOutgoingRequests();
  const { data: allUsers = [], isLoading: usersLoading } = useAllUsers();

  // Mutations
  const sendRequest = useSendFriendRequest();
  const acceptRequest = useAcceptRequest();
  const rejectRequest = useRejectRequest();
  const cancelRequest = useCancelRequest();
  const deleteFriend = useDeleteFriend();

  // 외부 클릭 시 모달 닫기
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  // 친구 신청 가능 여부 확인
  const canSendRequest = (userId: number) => {
    const isFriend = friends.some((f) => f.userId === userId);
    const hasSentRequest = outgoing.some((r) => r.receiverId === userId);
    const hasReceivedRequest = incoming.some((r) => r.senderId === userId);
    return !isFriend && !hasSentRequest && !hasReceivedRequest;
  };

  // 탭 설정
  const tabs: { key: TabType; label: string; count?: number }[] = [
    { key: "friends", label: "친구", count: friends.length },
    { key: "incoming", label: "받은 요청", count: incoming.length },
    { key: "outgoing", label: "보낸 요청", count: outgoing.length },
    { key: "users", label: "사용자 찾기" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div
        ref={modalRef}
        className="w-full max-w-md bg-[#1a1a1a] border border-[#333] rounded-lg shadow-2xl"
      >
        {/* 헤더 */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#333]">
          <h2 className="text-lg font-semibold text-white">친구</h2>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 탭 */}
        <div className="flex border-b border-[#333]">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 px-3 py-2 text-sm font-medium transition-colors ${activeTab === tab.key
                ? "text-[#816BFF] border-b-2 border-[#816BFF]"
                : "text-gray-400 hover:text-white"
                }`}
            >
              {tab.label}
              {tab.count !== undefined && tab.count > 0 && (
                <span className="ml-1 text-xs">({tab.count})</span>
              )}
            </button>
          ))}
        </div>

        {/* 컨텐츠 - 25개 초과 시 스크롤 */}
        <div className="max-h-[400px] overflow-y-auto">
          {/* 친구 목록 탭 */}
          {activeTab === "friends" && (
            <div className="p-2">
              {friendsLoading ? (
                <LoadingState />
              ) : friends.length === 0 ? (
                <EmptyState message="친구가 없습니다" />
              ) : (
                <ul>
                  {friends.map((friend) => (
                    <FriendItem
                      key={friend.userId}
                      friend={friend}
                      onDelete={() => deleteFriend.mutate(friend.userId)}
                      isDeleting={deleteFriend.isPending}
                    />
                  ))}
                </ul>
              )}
            </div>
          )}

          {/* 받은 요청 탭 */}
          {activeTab === "incoming" && (
            <div className="p-2">
              {incomingLoading ? (
                <LoadingState />
              ) : incoming.length === 0 ? (
                <EmptyState message="받은 요청이 없습니다" />
              ) : (
                <ul>
                  {incoming.map((request) => (
                    <RequestItem
                      key={request.requestId}
                      request={request}
                      type="incoming"
                      onAccept={() => acceptRequest.mutate(request.requestId)}
                      onReject={() => rejectRequest.mutate(request.requestId)}
                      isPending={
                        acceptRequest.isPending || rejectRequest.isPending
                      }
                    />
                  ))}
                </ul>
              )}
            </div>
          )}

          {/* 보낸 요청 탭 */}
          {activeTab === "outgoing" && (
            <div className="p-2">
              {outgoingLoading ? (
                <LoadingState />
              ) : outgoing.length === 0 ? (
                <EmptyState message="보낸 요청이 없습니다" />
              ) : (
                <ul>
                  {outgoing.map((request) => (
                    <RequestItem
                      key={request.requestId}
                      request={request}
                      type="outgoing"
                      onCancel={() => cancelRequest.mutate(request.requestId)}
                      isPending={cancelRequest.isPending}
                    />
                  ))}
                </ul>
              )}
            </div>
          )}

          {/* 사용자 찾기 탭 */}
          {activeTab === "users" && (
            <div className="p-2">
              {usersLoading ? (
                <LoadingState />
              ) : allUsers.length === 0 ? (
                <EmptyState message="사용자가 없습니다" />
              ) : (
                <ul>
                  {allUsers.map((user) => (
                    <UserItem
                      key={user.id}
                      user={user}
                      canSend={canSendRequest(user.id)}
                      onSendRequest={() => sendRequest.mutate(user.id)}
                      isPending={sendRequest.isPending}
                    />
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ===== 서브 컴포넌트 =====

const LoadingState = () => (
  <div className="py-8 text-center text-gray-500">로딩 중...</div>
);

const EmptyState = ({ message }: { message: string }) => (
  <div className="py-8 text-center text-gray-500">{message}</div>
);

interface FriendItemProps {
  friend: Friend;
  onDelete: () => void;
  isDeleting: boolean;
}

const FriendItem = ({ friend, onDelete, isDeleting }: FriendItemProps) => (
  <li className="flex items-center justify-between px-3 py-2 hover:bg-[#2a2a2a] rounded transition-colors">
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 bg-[#816BFF]/20 rounded-full flex items-center justify-center">
        <Users className="w-4 h-4 text-[#816BFF]" />
      </div>
      <div>
        <p className="text-sm text-white font-medium">{friend.nickname}</p>
        <p className="text-xs text-gray-500">{friend.email}</p>
      </div>
    </div>
    <button
      onClick={onDelete}
      disabled={isDeleting}
      className="p-1.5 text-gray-400 hover:text-red-400 transition-colors disabled:opacity-50"
      title="친구 삭제"
    >
      <Trash2 className="w-4 h-4" />
    </button>
  </li>
);

interface RequestItemProps {
  request: FriendRequest;
  type: "incoming" | "outgoing";
  onAccept?: () => void;
  onReject?: () => void;
  onCancel?: () => void;
  isPending: boolean;
}

const RequestItem = ({
  request,
  type,
  onAccept,
  onReject,
  onCancel,
  isPending,
}: RequestItemProps) => (
  <li className="flex items-center justify-between px-3 py-2 hover:bg-[#2a2a2a] rounded transition-colors">
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 bg-yellow-500/20 rounded-full flex items-center justify-center">
        <Clock className="w-4 h-4 text-yellow-500" />
      </div>
      <div>
        <p className="text-sm text-white font-medium">
          {type === "incoming"
            ? request.senderNickname || `사용자 #${request.senderId}`
            : request.receiverNickname || `사용자 #${request.receiverId}`}
        </p>
        <p className="text-xs text-gray-500">대기 중</p>
      </div>
    </div>
    <div className="flex gap-1">
      {type === "incoming" ? (
        <>
          <button
            onClick={onAccept}
            disabled={isPending}
            className="p-1.5 text-green-400 hover:bg-green-400/20 rounded transition-colors disabled:opacity-50"
            title="수락"
          >
            <UserCheck className="w-4 h-4" />
          </button>
          <button
            onClick={onReject}
            disabled={isPending}
            className="p-1.5 text-red-400 hover:bg-red-400/20 rounded transition-colors disabled:opacity-50"
            title="거절"
          >
            <X className="w-4 h-4" />
          </button>
        </>
      ) : (
        <button
          onClick={onCancel}
          disabled={isPending}
          className="p-1.5 text-gray-400 hover:text-red-400 transition-colors disabled:opacity-50"
          title="취소"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  </li>
);

interface UserItemProps {
  user: User;
  canSend: boolean;
  onSendRequest: () => void;
  isPending: boolean;
}

const UserItem = ({ user, canSend, onSendRequest, isPending }: UserItemProps) => (
  <li className="flex items-center justify-between px-3 py-2 hover:bg-[#2a2a2a] rounded transition-colors">
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 bg-gray-500/20 rounded-full flex items-center justify-center">
        <Users className="w-4 h-4 text-gray-400" />
      </div>
      <div>
        <p className="text-sm text-white font-medium">{user.nickName}</p>
        <p className="text-xs text-gray-500">{user.email}</p>
      </div>
    </div>
    {canSend ? (
      <button
        onClick={onSendRequest}
        disabled={isPending}
        className="flex items-center gap-1 px-2 py-1 text-xs text-[#816BFF] bg-[#816BFF]/10 hover:bg-[#816BFF]/20 rounded transition-colors disabled:opacity-50"
      >
        <UserPlus className="w-3 h-3" />
        신청
      </button>
    ) : (
      <span className="text-xs text-gray-500">신청 불가</span>
    )}
  </li>
);

export default FriendModal;
