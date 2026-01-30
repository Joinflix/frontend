import { useState, useRef, useEffect } from "react";
import { Bell, Check, Trash2 } from "lucide-react";
import { useSse, type SseNotification } from "../../contexts/SseContext";
import {
  SSE_EVENT_CONFIG,
  getDefaultIcon,
  type SseEventType,
} from "../../config/sseEventConfig";

// 시간을 상대적으로 표시
const formatRelativeTime = (date: Date): string => {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffHour = Math.floor(diffMs / 3600000);
  const diffDay = Math.floor(diffMs / 86400000);

  if (diffMin < 1) return "방금 전";
  if (diffMin < 60) return `${diffMin}분 전`;
  if (diffHour < 24) return `${diffHour}시간 전`;
  if (diffDay < 7) return `${diffDay}일 전`;
  return date.toLocaleDateString("ko-KR");
};

// config 기반 아이콘 가져오기
const getNotificationIcon = (type: string) => {
  const config = SSE_EVENT_CONFIG[type as SseEventType];
  return config ? config.getIcon() : getDefaultIcon();
};

const NotificationButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    clearNotifications,
  } = useSse();

  // 외부 클릭 시 드롭다운 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNotificationClick = (notification: SseNotification) => {
    if (!notification.isRead) {
      markAsRead(notification.id);
    }
    // TODO: 알림 타입에 따라 페이지 이동 등 추가 동작
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* 벨 아이콘 버튼 */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-white hover:text-[#816BFF] transition-colors"
        aria-label="알림"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <Bell className="w-6 h-6" />
        {/* 읽지 않은 알림 배지 */}
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* 드롭다운 메뉴 */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-[#1a1a1a] border border-[#333] rounded-[2px] shadow-xl z-50">
          {/* 헤더 */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-[#333]">
            <h3 className="text-white font-semibold">알림</h3>
            <div className="flex gap-2">
              {notifications.length > 0 && (
                <>
                  <button
                    onClick={markAllAsRead}
                    className="text-gray-400 hover:text-white p-1"
                    title="모두 읽음 처리"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                  <button
                    onClick={clearNotifications}
                    className="text-gray-400 hover:text-white p-1"
                    title="모두 삭제"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>
          </div>

          {/* 알림 목록 */}
          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="py-8 text-center text-gray-500">
                알림이 없습니다
              </div>
            ) : (
              <ul>
                {notifications.map((notification) => (
                  <li
                    key={notification.id}
                    onClick={() => handleNotificationClick(notification)}
                    className={`flex items-start gap-3 px-4 py-3 cursor-pointer hover:bg-[#2a2a2a] transition-colors ${
                      !notification.isRead ? "bg-[#252525]" : ""
                    }`}
                  >
                    {/* 아이콘 */}
                    <div className="shrink-0 mt-1">
                      {getNotificationIcon(notification.type)}
                    </div>

                    {/* 내용 */}
                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-sm ${
                          !notification.isRead
                            ? "text-white font-medium"
                            : "text-gray-300"
                        }`}
                      >
                        {notification.title}
                      </p>
                      <p className="text-sm text-gray-400 truncate">
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {formatRelativeTime(notification.timestamp)}
                      </p>
                    </div>

                    {/* 읽지 않음 표시 */}
                    {!notification.isRead && (
                      <div className="shrink-0 w-2 h-2 mt-2 bg-[#816BFF] rounded-full" />
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationButton;
