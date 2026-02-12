import { create } from "zustand";
import type { Notification, NotificationType } from "../hooks/useNotification";
import { devtools } from "zustand/middleware";

interface NotificationStore {
  notifications: Record<NotificationType, Notification[]>;
  setNotifications: (data: Record<NotificationType, Notification[]>) => void;
  addNotifications: (data: Record<NotificationType, Notification[]>) => void;
  removeNotification: (type: NotificationType, id: number) => void;
}

const initialNotifications: Record<NotificationType, Notification[]> = {
  FRIEND_REQUEST: [],
  FRIEND_ACCEPT: [],
  FRIEND_REJECT: [],
  EVENT_DELETE: [],
  EVENT_CANCEL: [],
  PARTY_INVITE: [],
};

export const useNotificationStore = create<NotificationStore>()(
  devtools(
    (set) => ({
      notifications: { ...initialNotifications },
      setNotifications: (data) => set({ notifications: data }),
      addNotifications: (groupedData) =>
        set((state) => {
          const updated = { ...state.notifications };

          (
            Object.entries(groupedData) as [NotificationType, Notification[]][]
          ).forEach(([type, items]) => {
            if (!updated[type]) {
              updated[type] = [];
            }
            const existingIds = new Set(updated[type].map((n) => n.id));
            const newUniqueItems = groupedData[type].filter(
              (n) => !existingIds.has(n.id),
            );

            updated[type] = [...newUniqueItems, ...updated[type]];
          });

          return { notifications: updated };
        }),
      removeNotification: (type, id) =>
        set((state) => ({
          notifications: {
            ...state.notifications,
            [type]: state.notifications[type]?.filter((n) => n.id !== id) || [],
          },
        })),
    }),
    { name: "NotificationStore" },
  ),
);

export const useUnreadNotificationCount = () =>
  useNotificationStore((state) =>
    Object.values(state.notifications).reduce(
      (sum, list) => sum + list.length,
      0,
    ),
  );
