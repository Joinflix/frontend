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
  const reconnectTimeoutRef = useRef<number | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const MAX_RECONNECT_ATTEMPTS = 3;

  const addNotifications = useNotificationStore(
    (state) => state.addNotifications,
  );

  useEffect(() => {
    // Only subscribe when BOTH conditions are met
    if (!isAuthChecked || !accessToken) {
      // Clean up any existing connection
      if (esRef.current) {
        esRef.current.close();
        esRef.current = null;
      }
      // Reset reconnect attempts when auth changes
      reconnectAttemptsRef.current = 0;
      return;
    }

    const subscribeUrl = `${API_BASE_URL}/notifications/subscribe`;

    try {
      const es = new EventSource(subscribeUrl, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        heartbeatTimeout: 3_600_000,
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
          console.error("Failed to parse notification:", err);
        }
      });

      es.onopen = () => {
        // Reset reconnect attempts on successful connection
        reconnectAttemptsRef.current = 0;
      };

      es.onmessage = (event) => {
        if (event.data === "connected") {
          return;
        }
      };

      es.onerror = (error: any) => {
        console.error("SSE connection error:", error);

        // Close the current connection
        if (esRef.current) {
          esRef.current.close();
          esRef.current = null;
        }

        // Check if we still have a valid token in store
        const currentToken = useAuthStore.getState().accessToken;
        if (!currentToken) {
          console.log("No token available, stopping SSE reconnection");
          return;
        }

        // Implement exponential backoff for reconnection
        if (reconnectAttemptsRef.current < MAX_RECONNECT_ATTEMPTS) {
          const backoffDelay = Math.min(
            1000 * Math.pow(2, reconnectAttemptsRef.current),
            10000,
          );
          reconnectAttemptsRef.current++;

          console.log(
            `Attempting SSE reconnection ${reconnectAttemptsRef.current}/${MAX_RECONNECT_ATTEMPTS} in ${backoffDelay}ms`,
          );

          if (reconnectTimeoutRef.current) {
            clearTimeout(reconnectTimeoutRef.current);
          }

          reconnectTimeoutRef.current = window.setTimeout(() => {
            reconnectTimeoutRef.current = null;
            // Force re-run of effect by updating a dummy state if needed
            // Or the effect will re-run naturally when accessToken updates
          }, backoffDelay);
        } else {
          console.error("Max SSE reconnection attempts reached");
          // Note: axios interceptor will handle token refresh for API calls
          // SSE will reconnect when token is refreshed
        }
      };

      esRef.current = es;
    } catch (error) {
      console.error("Failed to create SSE connection:", error);
    }

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }
      if (esRef.current) {
        esRef.current.close();
        esRef.current = null;
      }
    };
  }, [accessToken, addNotifications, isAuthChecked, queryClient]);
};
