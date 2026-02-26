import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import UserList from "./UserList";
import { useAuthStore } from "../../store/useAuthStore";
import { useRef, useState } from "react";
import SearchFilter, { type PrimaryFilter } from "./SearchFilter";
import { useFriendSearch } from "../../api/queries/useFriendSearch";
import { useDebounce } from "../../hooks/useDebounce";
import type { FriendStatus } from "../../types/friend";

// UserSearchResponse (BE)
export interface Friend {
  userId: number;
  email: string;
  nickname: string;
  profileImageUrl: string;
  status: FriendStatus;
  requestId: number;
  priority: number;
}

interface FriendSearchDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  pendingIds: Set<number>;
  onRequest: (id: number) => void;
  onRemove: (id: number) => void;
  onAccept: (id: number) => void;
  onRefuse: (id: number) => void;
}

const EMPTY_MESSAGES: Record<string, string> = {
  FRIEND: "맺어진 친구가 없습니다.",
  PENDING: "보낸 친구 요청이 없습니다.",
  REQUESTED: "받은 친구 요청이 없습니다.",
  ALL: "사용자가 없습니다.",
};

const FriendSearchDialog = ({
  isOpen,
  onOpenChange,
  onRequest,
  onRemove,
  onAccept,
  onRefuse,
}: FriendSearchDialogProps) => {
  const userId = useAuthStore((state) => state.user?.userId);

  const [primary, setPrimary] = useState<PrimaryFilter>("ALL");
  const [secondary, setSecondary] = useState("ALL");
  const [searchWord, setSearchWord] = useState("");

  const debouncedSearchWord = useDebounce(searchWord, 400);

  const triggerRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    const container = scrollContainerRef.current;
    if (!container || !hasNextPage || isFetchingNextPage) return;

    const { scrollTop, scrollHeight, clientHeight } = container;
    if (scrollTop + clientHeight >= scrollHeight - 50) {
      fetchNextPage?.();
    }
  };

  const handlePrimaryChange = (newPrimary: PrimaryFilter) => {
    setPrimary(newPrimary);
    setSecondary("ALL");
    setSearchWord("");
  };

  const {
    data,
    isLoading: isLoadingFriends,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useFriendSearch(primary, secondary, debouncedSearchWord);

  const users = data?.pages.flatMap((page) => page.content) || [];

  const emptyMessage = EMPTY_MESSAGES[secondary] ?? "사용자가 없습니다.";

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="bg-zinc-900/95 backdrop-blur-xl border border-white/10 text-white rounded-3xl max-w-md shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold tracking-tight">
            친구 찾기
          </DialogTitle>
          <DialogDescription asChild>
            <div className="flex flex-row items-center gap-3 mt-4 w-full">
              <SearchFilter
                primary={primary}
                setPrimary={handlePrimaryChange}
                secondary={secondary}
                setSecondary={setSecondary}
                searchWord={searchWord}
                setSearchWord={setSearchWord}
              />
            </div>
          </DialogDescription>
        </DialogHeader>

        {/* User List Area */}
        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="mt-2 h-[50vh] overflow-y-auto pr-2 scrollbar-hidden flex flex-col gap-1"
        >
          {isLoadingFriends ? (
            <div className="text-center py-10 text-zinc-500 text-sm animate-pulse">
              사용자를 불러오는 중...
            </div>
          ) : users?.length > 0 ? (
            <>
              {(Array.isArray(users) ? users : [])
                .filter((user) => user.userId !== userId)
                .map((user) => (
                  <UserList
                    key={user.userId}
                    user={user}
                    onRequest={() => onRequest(user.userId)}
                    onRemove={() => onRemove(user.requestId)}
                    onAccept={() => onAccept(user.requestId)}
                    onRefuse={() => onRefuse(user.requestId)}
                  />
                ))}

              {/* This is the invisible trigger element */}
              <div ref={triggerRef} className="py-4 flex justify-center">
                {isFetchingNextPage ? (
                  <div className="text-xs text-[#816BFF] animate-pulse">
                    더 불러오는 중...
                  </div>
                ) : hasNextPage ? (
                  <div className="h-2" /> // Spacer that triggers the fetch
                ) : (
                  <div className="text-xs text-zinc-600">
                    마지막 사용자입니다.
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <div className="text-center py-10 text-zinc-500 text-sm">
                {emptyMessage}
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FriendSearchDialog;
