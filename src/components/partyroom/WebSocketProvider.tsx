import { useEffect } from "react";
import { useAuthStore } from "../../store/useAuthStore";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import { Outlet } from "react-router";
import { useWebSocketStore } from "../../store/useWebSocketStore";

const WebSocketProvider = () => {
  const stompClient = useWebSocketStore((state) => state.stompClient);
  const setStompClient = useWebSocketStore((state) => state.setStompClient);

  const accessToken = useAuthStore((state) => state.accessToken);
  const getBearerToken = (token: string) =>
    token.startsWith("Bearer ") ? token : `Bearer ${token}`;

  useEffect(() => {
    if (!stompClient && accessToken) {
      const client = new Client({
        webSocketFactory: () => new SockJS("http://localhost:8080/ws-stomp"),
        connectHeaders: {
          Authorization: `${getBearerToken(accessToken ?? "")}`,
        },
        debug: (str) => console.log("STOMP Debug:", str),
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
        onConnect: () => {
          alert("Established WebSocket Connection");
        },
        onStompError: (frame) => {
          console.error("Broker reported error: " + frame.headers["message"]);
          console.error("Additional details: " + frame.body);
        },
      });
      client.activate();
      setStompClient(client);

      return () => {
        if (stompClient) {
          stompClient.deactivate();
          setStompClient(null);
        }
      };
    }
  }, [stompClient, accessToken, setStompClient]);

  return <Outlet />;
};

export default WebSocketProvider;
