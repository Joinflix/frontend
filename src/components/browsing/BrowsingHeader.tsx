import { ContactRound, Search } from "lucide-react";
import { useNavigate } from "react-router";
import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import apiClient from "../../api/axios";
import FriendSearchDialog from "../friend/FriendSearchDialog";
import { AlertDropdown } from "./AlertDropdown";
import { ProfileDropdown } from "./ProfileDropdown";

const ICON_STYLE = "w-5 h-5 stroke-white cursor-pointer";

const BrowsingHeader = () => {
  const navigate = useNavigate();
  const [isFriendSearchOpen, setIsFriendSearchOpen] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [searchWord, setSearchWord] = useState("");
  const [pendingRequestIds, setPendingRequestIds] = useState<Set<number>>(
    new Set(),
  );

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

  const { mutateAsync: mutateAsyncAddFriend, isPending: isPendingAddFriend } =
    useMutation({
      mutationKey: ["addFriend"],
      mutationFn: async (receiverId: number) => {
        setPendingRequestIds((prev) => new Set(prev).add(receiverId));
        const res = await apiClient.post("/friends/requests", { receiverId });
        console.log(res.data);
        return res.data;
      },
      onSuccess: (res) => {},
      onError: (err, receiverId) => {
        setPendingRequestIds((prev) => {
          const next = new Set(prev);
          next.delete(receiverId);
          return next;
        });
      },
    });

  const handleClickAddFriend = (receiverId: number) => {
    alert("친구 추가");
    mutateAsyncAddFriend(receiverId);
  };

  const handleClickRemoveFriend = () => {
    alert("친구 삭제");
  };

  const handleClickAcceptFriend = () => {
    alert("친구 수락");
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
          onAdd={handleClickAddFriend}
          onRemove={handleClickRemoveFriend}
          onAccept={handleClickAcceptFriend}
        />

        <AlertDropdown isOpen={isAlertOpen} onOpenChange={setIsAlertOpen} />
        <ProfileDropdown />
      </div>
    </header>
  );
};

export default BrowsingHeader;
