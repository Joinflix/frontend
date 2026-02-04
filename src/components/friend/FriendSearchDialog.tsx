import { Search, CircleX } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import UserList from "./UserList";
import { useAuthStore } from "../../store/useAuthStore";

interface FriendSearchDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  searchWord: string;
  setSearchWord: (word: string) => void;
  users: any[];
  isLoading: boolean;
  pendingIds: Set<number>;
  onRequest: (id: number) => void;
  onRemove: (id: number) => void;
  onAccept: (id: number) => void;
  onRefuse: (id: number) => void;
}

const FriendSearchDialog = ({
  isOpen,
  onOpenChange,
  searchWord,
  setSearchWord,
  users,
  isLoading,
  onRequest,
  onRemove,
  onAccept,
  onRefuse,
}: FriendSearchDialogProps) => {
  const userId = useAuthStore((state) => state.user?.userId);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="bg-zinc-900/95 backdrop-blur-xl border border-white/10 text-white rounded-3xl max-w-md shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold tracking-tight">
            친구 찾기
          </DialogTitle>
          <DialogDescription asChild>
            <div className="flex flex-col gap-4 mt-4">
              {/* Organic Search Bar */}
              <div className="relative flex items-center group">
                <div className="absolute left-4 text-zinc-500 transition-colors group-focus-within:text-[#816BFF]">
                  <Search size={18} />
                </div>
                <input
                  className="w-full bg-white/5 border border-white/5 rounded-lg py-3 pl-11 pr-11 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#816BFF]/50 transition-all"
                  type="text"
                  placeholder="닉네임 혹은 이메일로 검색"
                  value={searchWord}
                  onChange={(e) => setSearchWord(e.target.value)}
                />
                {searchWord && (
                  <button
                    className="absolute right-4 text-zinc-500 hover:text-white transition-colors cursor-pointer"
                    onClick={() => setSearchWord("")}
                  >
                    <CircleX size={18} />
                  </button>
                )}
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>

        {/* User List Area */}
        <div className="mt-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar flex flex-col gap-1">
          {isLoading ? (
            <div className="text-center py-10 text-zinc-500 text-sm animate-pulse">
              사용자를 불러오는 중...
            </div>
          ) : users?.length > 0 ? (
            users
              .filter((user) => user.id !== userId)
              .map((user) => (
                <UserList
                  key={user.id}
                  user={user}
                  onRequest={() => onRequest(user.id)}
                  onRemove={() => onRemove(user.requestId)}
                  onAccept={() => onAccept(user.requestId)}
                  onRefuse={() => onRefuse(user.requestId)}
                />
              ))
          ) : (
            <div className="text-center py-10 text-zinc-500 text-sm italic">
              {searchWord ? "검색 결과가 없습니다." : "검색어를 입력해보세요."}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FriendSearchDialog;
