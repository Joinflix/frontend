import { ContactRound, Search } from "lucide-react";
import { useNavigate } from "react-router";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import apiClient from "../../api/axios";
import FriendSearchDialog from "../friend/FriendSearchDialog";
import { AlertDropdown } from "./AlertDropdown";
import { ProfileDropdown } from "./ProfileDropdown";
import { useFriendActions } from "../../api/queries/useFriendActions";

const ICON_STYLE = "w-5 h-5 stroke-white cursor-pointer";

const BrowsingHeader = () => {
  const navigate = useNavigate();
  const [isFriendSearchOpen, setIsFriendSearchOpen] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [searchWord, setSearchWord] = useState("");
  const [pendingRequestIds, setPendingRequestIds] = useState<Set<number>>(
    new Set(),
  );

  const { requestFriend, removeFriend, acceptFriend, refuseFriend } =
    useFriendActions(setPendingRequestIds);

  const handleClickLogo = () => {
    navigate("/browsing");
  };

  const handleClickFriendSearch = () => {
    setIsFriendSearchOpen(true);
  };

  const { data: allUsers, isPending: allUsersIsPending } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await apiClient("/users/search");
      return res.data;
    },
  });

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

  return (
    <header className="fixed top-0 w-full z-50 flex flex-row justify-between py-3 px-6 bg-linear-to-b from-black via-black/70">
      <div
        className="text-[#816BFF] font-bold text-sm md:text-base lg:text-2xl uppercase cursor-pointer"
        onClick={handleClickLogo}
      >
        joinflix
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
          users={allUsers?.content}
          isLoading={allUsersIsPending}
          pendingIds={pendingRequestIds}
          onRequest={handleClickRequestFriend}
          onRemove={handleClickRemoveFriend}
          onAccept={handleClickAcceptFriend}
          onRefuse={handleClickRefuseFriend}
        />

        <AlertDropdown isOpen={isAlertOpen} onOpenChange={setIsAlertOpen} />
        <ProfileDropdown />
      </div>
    </header>
  );
};

export default BrowsingHeader;
