import { ContactRound, Search } from "lucide-react";
import { useLocation, useNavigate } from "react-router";
import { useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import apiClient from "../../api/axios";
import FriendSearchDialog from "../friend/FriendSearchDialog";
import { AlertDropdown } from "./AlertDropdown";
import { ProfileDropdown } from "./ProfileDropdown";
import { useFriendActions } from "../../api/queries/useFriendActions";
import { useAuthStore } from "../../store/useAuthStore";

const ICON_STYLE = "w-7 h-7 stroke-white cursor-pointer";

const BrowsingHeader = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [isFriendSearchOpen, setIsFriendSearchOpen] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const [searchWord, setSearchWord] = useState("");
  const [pendingRequestIds, setPendingRequestIds] = useState<Set<number>>(
    new Set(),
  );

  const { requestFriend, removeFriend, acceptFriend, refuseFriend } =
    useFriendActions(setPendingRequestIds);

  const nickname = useAuthStore((state) => state.user?.nickname);

  const handleClickFriendSearch = () => {
    setIsFriendSearchOpen(true);
  };

  const {
    data,
    isPending: allUsersIsPending,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["users", searchWord],
    queryFn: async ({ pageParam = null }) => {
      const res = await apiClient("/users/search", {
        params: {
          cursorId: pageParam,
          size: 10,
          keyword: searchWord,
        },
      });
      return res.data;
    },
    getNextPageParam: (lastPage) => {
      if (lastPage.last || lastPage.content.length === 0) return undefined;
      const lastItem = lastPage.content[lastPage.content.length - 1];
      return lastItem?.id;
    },
    initialPageParam: null,
    enabled: isFriendSearchOpen,
  });

  const allUsersList = data?.pages.flatMap((page) => page.content) || [];

  const handleClickRequestFriend = (receiverId: number) => {
    requestFriend(receiverId);
  };

  const handleClickRemoveFriend = (requestId: number) => {
    removeFriend(requestId);
  };

  const handleClickAcceptFriend = (requestId: number) => {
    acceptFriend(requestId);
  };

  const handleClickRefuseFriend = (requestId: number) => {
    refuseFriend(requestId);
  };

  const handleClickHome = () => {
    navigate("/browsing");
  };

  const handleClickParty = () => {
    navigate("/party");
  };

  const getTabStyle = (path: string) => {
    const isActive = location.pathname === path;
    return isActive
      ? "text-white font-bold text-lg cursor-pointer border-b-3 border-white px-2 h-full flex items-center"
      : "text-zinc-500 text-lg hover:text-white hover:font-bold cursor-pointer transition-colors border-b-3 border-transparent px-2";
  };

  return (
    <header className="fixed top-0 w-full h-20 z-50 flex flex-row justify-between px-6 bg-linear-to-b from-black via-black/90 to-black/10 items-center">
      <div className="flex items-center gap-8">
        <div className="text-[#816BFF] font-bold text-2xl uppercase cursor-pointer">
          joinflix
        </div>

        <div className="flex items-center gap-4">
          <div className={getTabStyle("/browsing")} onClick={handleClickHome}>
            홈
          </div>

          <div className={getTabStyle("/party")} onClick={handleClickParty}>
            파티
          </div>
        </div>
      </div>
      <div className="flex flex-row gap-2 items-center">
        <Search className={ICON_STYLE} />

        <ContactRound
          className={ICON_STYLE}
          onClick={handleClickFriendSearch}
        />

        <FriendSearchDialog
          isOpen={isFriendSearchOpen}
          onOpenChange={setIsFriendSearchOpen}
          searchWord={searchWord}
          setSearchWord={setSearchWord}
          users={allUsersList}
          isLoading={allUsersIsPending}
          pendingIds={pendingRequestIds}
          onRequest={handleClickRequestFriend}
          onRemove={handleClickRemoveFriend}
          onAccept={handleClickAcceptFriend}
          onRefuse={handleClickRefuseFriend}
          hasNextPage={hasNextPage}
          fetchNextPage={fetchNextPage}
          isFetchingNextPage={isFetchingNextPage}
        />

        <AlertDropdown
          isOpen={isAlertOpen}
          onOpenChange={setIsAlertOpen}
          iconStyle={ICON_STYLE}
        />

        <div
          className="flex flex-row gap-2 items-center ml-2 cursor-pointer"
          onClick={() => setIsProfileOpen((prev) => !prev)}
        >
          <ProfileDropdown
            isOpen={isProfileOpen}
            onOpenChange={setIsProfileOpen}
            iconStyle={ICON_STYLE}
            initial={nickname?.charAt(0)}
          />
          <span className="text-extrabold text-white text-base">
            {nickname}
          </span>
        </div>
      </div>
    </header>
  );
};

export default BrowsingHeader;
