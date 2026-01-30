import type { ReactNode } from "react";
import { Bell, Users, UserPlus } from "lucide-react";

// SSE 이벤트 타입
export type SseEventType =
  | "friend.request.received"
  | "friend.request.accepted"
  | "presence.online"
  | "presence.offline";

// 이벤트 설정 인터페이스
export interface SseEventConfig {
  title: string;
  getMessage: (data: Record<string, unknown>) => string;
  getIcon: () => ReactNode;
}

// SSE 이벤트 설정
// 새 이벤트 추가 시 여기만 수정하면 됩니다
export const SSE_EVENT_CONFIG: Record<SseEventType, SseEventConfig> = {
  "friend.request.received": {
    title: "친구 요청",
    getMessage: (data) =>
      `${(data.senderNickname as string) || "누군가"}님이 친구 요청을 보냈습니다.`,
    getIcon: () => <UserPlus className="w-5 h-5 text-[#816BFF]" />,
  },
  "friend.request.accepted": {
    title: "친구 요청 수락",
    getMessage: (data) =>
      `${(data.receiverNickname as string) || "누군가"}님이 친구 요청을 수락했습니다.`,
    getIcon: () => <Users className="w-5 h-5 text-green-500" />,
  },
  "presence.online": {
    title: "친구 온라인",
    getMessage: (data) =>
      `${(data.nickname as string) || "친구"}님이 접속했습니다.`,
    getIcon: () => <div className="w-2 h-2 bg-green-500 rounded-full" />,
  },
  "presence.offline": {
    title: "친구 오프라인",
    getMessage: (data) =>
      `${(data.nickname as string) || "친구"}님이 퇴장했습니다.`,
    getIcon: () => <div className="w-2 h-2 bg-gray-500 rounded-full" />,
  },
};

// 지원하는 모든 이벤트 타입 목록
export const SSE_EVENT_TYPES = Object.keys(SSE_EVENT_CONFIG) as SseEventType[];

// 기본 아이콘 (알 수 없는 이벤트용)
export const getDefaultIcon = (): ReactNode => (
  <Bell className="w-5 h-5 text-gray-400" />
);
