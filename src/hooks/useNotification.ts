import { useEffect, useRef } from "react";
import { EventSourcePolyfill, NativeEventSource } from "event-source-polyfill";
import { useAuthStore } from "../store/useAuthStore";
import { API_BASE_URL } from "../global/const/api";
import { useNotificationStore } from "../store/useNotificationStore";
import { useQueryClient } from "@tanstack/react-query";

const EventSource = EventSourcePolyfill || NativeEventSource;

export type NotificationType =
  | "FRIEND_REQUEST"
  | "FRIEND_ACCEPT"
  | "FRIEND_REJECT"
  | "EVENT_DELETE"
  | "EVENT_CANCEL"
  | "PARTY_INVITE";

export interface Notification {
  id: number;
  message: string;
  createdAt: string;
  notificationType: NotificationType;
}

export const useNotification = () => {
  const { accessToken, isAuthChecked } = useAuthStore();
  const esRef = useRef<EventSourcePolyfill | null>(null);
  const queryClient = useQueryClient();

  const addNotifications = useNotificationStore(
    (state) => state.addNotifications,
  );

  useEffect(() => {
    // 토큰이 있고, 인증 체크가 끝난 상태에서만 구독 시작
    if (!isAuthChecked || !accessToken) return;

    const subscribeUrl = `${API_BASE_URL}/notifications/subscribe`;

    const es = new EventSource(subscribeUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      heartbeatTimeout: 3_600_000, //1시간
    });

    es.addEventListener("notification", (event) => {
      try {
        const data = JSON.parse(event.data);
        const notifications: Notification[] = Array.isArray(data)
          ? data
          : [data];

        const grouped: Record<NotificationType, Notification[]> = {
          FRIEND_REQUEST: [],
          FRIEND_ACCEPT: [],
          FRIEND_REJECT: [],
          EVENT_DELETE: [],
          EVENT_CANCEL: [],
          PARTY_INVITE: [],
        };

        let shouldInvalidateUsers = false;

        notifications.forEach((noti) => {
          if (
            noti.notificationType.startsWith("FRIEND_") ||
            noti.notificationType.startsWith("EVENT_")
          ) {
            shouldInvalidateUsers = true;
          }

          if (noti.notificationType.startsWith("EVENT_")) {
            return;
          }

          grouped[noti.notificationType].push(noti);
        });

        addNotifications(grouped);

        if (shouldInvalidateUsers) {
          queryClient.invalidateQueries({
            queryKey: ["users"],
            type: "active",
          });
        }
      } catch (err) {
        console.error(err);
      }
    });

    // 서버에서 보내는 이벤트 이름(name) 확인.
    // 기본 이벤트 onmessage, 특정 이름 addEventListener 사용
    es.onmessage = (event) => {
      if (event.data === "connected") {
        return;
      }
      const data = JSON.parse(event.data);

      // TODO: zustand 스토어의 알림 상태를 업데이트하거나
    };

    es.onerror = (error) => {
      console.error("SSE 연결 에러:", error);
      // 401 에러 등이 발생하면 토큰 재발급?
    };

    esRef.current = es;

    // 로그아웃 시에 자동 해제?
    return () => {
      es.close();
    };
  }, [accessToken, addNotifications, isAuthChecked, queryClient]);
};
