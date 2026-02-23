import { useEffect, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import type { ChatStompMessage } from "../types/chat";
import type { Client, IMessage } from "@stomp/stompjs";

interface UsePartyChatProps {
  partyId: number | undefined;
  stompClient: Client | null;
  isConnected: boolean;
  accessToken: string | null;
  onPartyClosed: () => void;
}

export const usePartyChat = ({
  partyId,
  stompClient,
  isConnected,
  accessToken,
  onPartyClosed,
}: UsePartyChatProps) => {
  const queryClient = useQueryClient();
  const [chatMessages, setChatMessages] = useState<ChatStompMessage[]>([]);
  const [memberCount, setMemberCount] = useState<number | null>(null);
  const hasLeftManually = useRef(false);

  useEffect(() => {
    const wasRefresh = sessionStorage.getItem("partyRefresh");
    if (wasRefresh) {
      sessionStorage.removeItem("partyRefresh");
      hasLeftManually.current = true;
    }
  }, []);

  useEffect(() => {
    if (!stompClient || !partyId) return;
    if (!stompClient.connected) return;

    const authHeader = {
      Authorization: accessToken?.startsWith("Bearer ")
        ? accessToken
        : `Bearer ${accessToken}`,
    };

    // 1. 텍스트 채팅 구독 (Subscribe to Text Chat)
    const textChatSub = stompClient.subscribe(
      `/sub/party/${partyId}`,
      (stompMessage: IMessage) => {
        const messageContent = JSON.parse(stompMessage.body);

        // 퇴장 발생 시 파티 데이터 갱신
        if (messageContent.messageType === "LEAVE") {
          queryClient.invalidateQueries({
            queryKey: ["partyRoomData", partyId],
          });

          if (messageContent.currentCount === 0 && !hasLeftManually.current) {
            // 만약 이 메시지를 받은 사용자가 아직 방에 있다면 (에러 상황 대비)
            onPartyClosed();
          }
        }

        if (messageContent.currentCount !== undefined) {
          setMemberCount(messageContent.currentCount);
        }
        setChatMessages((prev) => [...prev, messageContent]);
      },
    );

    // 2. 입장 신호 전송 (Text Chat subscription 직후 1회, publish ENTER signal)
    stompClient.publish({
      destination: `/pub/party/${partyId}/enter`,
      headers: authHeader,
    });

    return () => {
      textChatSub?.unsubscribe();
    };
  }, [stompClient, isConnected, partyId, accessToken, queryClient]);

  // 텍스트 채팅 메시지 전송 함수
  const sendChat = (text: string) => {
    if (stompClient?.connected && partyId) {
      stompClient.publish({
        destination: `/pub/party/${partyId}/talk`,
        headers: {
          Authorization: accessToken?.startsWith("Bearer ")
            ? accessToken
            : `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ message: text }),
      });
    }
  };

  const markAsLeftManually = () => {
    hasLeftManually.current = true;
  };

  return {
    chatMessages,
    memberCount,
    sendChat,
    setChatMessages,
    markAsLeftManually,
  };
};
