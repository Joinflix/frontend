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

interface AlertDropdownProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const ICON_STYLE = "w-5 h-5 stroke-white cursor-pointer";

export const AlertDropdown = ({ isOpen, onOpenChange }: AlertDropdownProps) => {
  const alarmCount = useUnreadNotificationCount();
  const notifications = useNotificationStore((state) => state.notifications);
  const allNotifications = Object.values(notifications)
    .flat()
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

  return (
    <div className="relative">
      <DropdownMenu open={isOpen} onOpenChange={onOpenChange}>
        <DropdownMenuTrigger asChild>
          <div className="relative cursor-pointer">
            <Bell className={ICON_STYLE} />
            {alarmCount > 0 && (
              <span
                className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1
        rounded-full bg-red-500 text-[10px] font-medium text-white
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
