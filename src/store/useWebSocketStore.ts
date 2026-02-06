import { Client } from "@stomp/stompjs";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

type WebSocketState = {
  stompClient: Client | null;
  isConnected: boolean;
  setStompClient: (client: Client | null) => void;
  setIsConnected: (connected: boolean) => void;
};

export const useWebSocketStore = create<WebSocketState>()(
  devtools(
    (set) => ({
      stompClient: null,
      isConnected: false,
      setStompClient: (client) => set({ stompClient: client }),
      setIsConnected: (connected) => set({ isConnected: connected }),
    }),
    { name: "WebSocketStore" },
  ),
);
