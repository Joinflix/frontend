import { Bell } from "lucide-react";
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
import { useNavigate } from "react-router";
import { useMutation } from "@tanstack/react-query";
import apiClient from "../../api/axios";

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

export const AlertDropdown = ({
  isOpen,
  onOpenChange,
  iconStyle,
}: AlertDropdownProps) => {
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

  const navigate = useNavigate();

  const handleClickNotification = (noti: Notification) => {
    if (noti.notificationType === "PARTY_INVITE" && noti.eventId) {
      removeNotification(noti.notificationType, noti.id);
      mutateAsync(noti.id);
      navigate(`/watch/party/${noti.eventId}`);
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

  return (
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
                <span className="text-xs">{noti.message}</span>
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
  );
};
