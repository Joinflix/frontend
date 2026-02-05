import { Client } from "@stomp/stompjs";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

type WebSocketState = {
  stompClient: Client | null;
  setStompClient: (client: Client | null) => void;
};

export const useWebSocketStore = create<WebSocketState>()(
  devtools(
    (set) => ({
      stompClient: null,
      setStompClient: (client) => set({ stompClient: client }),
    }),
    { name: "WebSocketStore" },
  ),
);
