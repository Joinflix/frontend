import { Bell, UserRoundPlus, UserRoundX } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  useNotificationStore,
  useUnreadNotificationCount,
} from "../../store/useNotificationStore";
import { useMutation } from "@tanstack/react-query";
import apiClient from "../../api/axios";
import { ActionButton } from "../friend/ActionButton";
import { useFriendActions } from "../../api/queries/useFriendActions";
import { useState } from "react";
import PassCodeOtpModal from "../partyroom/PassCodeOtpModal";
import { useJoinParty } from "../../api/queries/useJoinParty";

interface AlertDropdownProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  iconStyle: string;
}

type NotificationType =
  | "FRIEND_REQUEST"
  | "FRIEND_ACCEPT"
  | "EVENT_REJECT"
  | "EVENT_DELETE"
  | "EVENT_CANCEL"
  | "PARTY_INVITE";

interface Notification {
  id: number;
  message: string;
  createdAt: string;
  notificationType: NotificationType;
  senderId: number;
  receiverId: number;
  eventId: number;
}

const BASE_STYLE =
  "flex items-center px-2 py-1.5 rounded-sm text-[10px] font-bold transition-all duration-300 border backdrop-blur-md active:scale-95 cursor-pointer z-50 hover:!text-white";

export const AlertDropdown = ({
  isOpen,
  onOpenChange,
  iconStyle,
}: AlertDropdownProps) => {
  const [selectedPartyId, setSelectedPartyId] = useState<number | null>(null);

  const { acceptFriend, refuseFriend } = useFriendActions();
  const handleClickAcceptFriend = (requestId: number) => {
    acceptFriend(requestId);
  };
  const handleClickRefuseFriend = (requestId: number) => {
    refuseFriend(requestId);
  };

  const alarmCount = useUnreadNotificationCount();
  const notifications = useNotificationStore((state) => state.notifications);
  const removeNotification = useNotificationStore(
    (state) => state.removeNotification,
  );
  const allNotifications = Object.values(notifications)
    .flat()
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

  const handleClickNotification = (noti: Notification) => {
    if (noti.notificationType === "PARTY_INVITE" && noti.eventId) {
      removeNotification(noti.notificationType, noti.id);
      mutateAsync(noti.id);
      setSelectedPartyId(noti.eventId);
    }

    if (noti.notificationType === "FRIEND_REQUEST") {
      removeNotification(noti.notificationType, noti.id);
    }
  };

  const { mutateAsync } = useMutation({
    mutationFn: async (notificationId: number) => {
      const res = await apiClient.post("/notifications/last-read-at", {
        notificationId,
      });
      return res.data;
    },
  });

  const { mutate: joinParty } = useJoinParty();

  return (
    <>
      <div className="relative">
        <DropdownMenu open={isOpen} onOpenChange={onOpenChange}>
          <DropdownMenuTrigger asChild>
            <div className="relative cursor-pointer">
              <Bell className={iconStyle} />
              {alarmCount > 0 && (
                <span
                  className="absolute -top-px -right-1 min-w-[16px] h-4 px-1
        rounded-full bg-[#816BFF] text-[10px] font-medium text-white
        flex items-center justify-center pointer-events-none"
                >
                  {alarmCount}
                </span>
              )}
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-zinc-900/90 backdrop-blur-xl border border-white/10 text-white rounded-xl min-w-[280px]">
            {allNotifications.length === 0 ? (
              <div className="p-4 text-center text-xs text-white/40">
                No new notifications
              </div>
            ) : (
              allNotifications.map((noti) => (
                <DropdownMenuItem
                  key={noti.id}
                  className="flex flex-col items-start gap-1 p-3 cursor-pointer hover:bg-white/10 transition-colors border-b border-white/5 last:border-0"
                  onClick={() => handleClickNotification(noti)}
                >
                  <div className="flex gap-4">
                    <span className="text-xs">{noti.message}</span>
                    {noti.notificationType === "FRIEND_REQUEST" && (
                      <div className="flex gap-2">
                        {/* 수락 */}
                        <ActionButton
                          label="수락"
                          icon={UserRoundPlus}
                          iconSize={12}
                          variantClassName={`${BASE_STYLE} bg-emerald-500/20 border-emerald-500/30 text-emerald-500 hover:bg-emerald-600 transition-colors`}
                          onClick={() => handleClickAcceptFriend(noti.eventId)}
                        />
                        {/* 거절 */}
                        <ActionButton
                          label="거절"
                          icon={UserRoundX}
                          iconSize={12}
                          variantClassName={`${BASE_STYLE}  bg-rose-500/20 border-rose-500/30 text-rose-500 hover:bg-rose-600 transition-colors`}
                          onClick={() => handleClickRefuseFriend(noti.eventId)}
                        />
                      </div>
                    )}
                  </div>
                  <span className="text-[10px]">
                    {new Date(noti.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </DropdownMenuItem>
              ))
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <PassCodeOtpModal
        selectedPartyId={selectedPartyId}
        onClose={() => setSelectedPartyId(null)}
        onJoin={(partyId, passCode) => {
          joinParty({ partyId, passCode });
        }}
      />
    </>
  );
};
