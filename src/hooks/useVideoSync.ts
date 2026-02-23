import { useEffect, useRef } from "react";
import type { VideoSyncMessage } from "../types/party";
import type { Client, IMessage } from "@stomp/stompjs";
import type { ChatStompMessage } from "../types/chat";
import type { User } from "../store/useAuthStore";

interface UseVideoSyncProps {
  partyId: number | undefined;
  videoRef: React.RefObject<HTMLVideoElement | null>;
  stompClient: Client | null;
  isConnected: boolean;
  isHost: boolean;
  hostControl: boolean;
  accessToken: string | null;
  setChatMessages: React.Dispatch<React.SetStateAction<ChatStompMessage[]>>;
  user: User | null;
}

export const useVideoSync = ({
  partyId,
  videoRef,
  stompClient,
  isConnected,
  isHost,
  hostControl,
  accessToken,
  setChatMessages,
  user,
}: UseVideoSyncProps) => {
  const isProcessingSync = useRef(false);
  const isUserSeeking = useRef(false);
  const isHostRef = useRef(isHost);

  // PartyRoomPage:70 이걸로 바꿔야 하나?
  // 호스트 상태 최신화
  useEffect(() => {
    isHostRef.current = isHost;
  }, [isHost]);

  // [발행] 서버로 비디오 상태 전송
  const handleVideoEvent = (action: "PLAY" | "PAUSE" | "SEEK") => {
    // 1. 기본 가드: 비디오 객체가 없거나, 동기화 중이거나, 소켓 미연결 시 무시
    if (
      !videoRef.current ||
      isProcessingSync.current ||
      !stompClient?.connected
    )
      return;

    // 2. 권한 가드: 호스트 전용 제어 모드인 경우, 유저가 호스트가 아닌 경우 무시
    if (hostControl && !isHost) return;

    // 3. STOMP 메시지로 보낼 비디오 동기화용 상태 정보 구성
    const state: VideoSyncMessage = {
      currentTime: videoRef.current.currentTime,
      paused: videoRef.current.paused,
      action,
      senderId: user?.userId,
    };

    // 4. 비디오 조작 시 STOMP 메시지 발행
    stompClient.publish({
      destination: `/pub/party/${partyId}/video`,
      body: JSON.stringify(state),
      headers: {
        Authorization: accessToken?.startsWith("Bearer ")
          ? accessToken
          : `Bearer ${accessToken}`,
      },
    });
  };

  // 비디오 동기화 구독 (Subscribe to Video Sync): 서버로부터 비디오 상태 수신
  useEffect(() => {
    if (!stompClient || !isConnected || !partyId) return;

    const videoSyncSub = stompClient.subscribe(
      `/sub/party/${partyId}/video`,
      (stompMessage: IMessage) => {
        const {
          messageType,
          senderNickname,
          currentTime,
          paused,
          message,
          senderId,
          action,
        } = JSON.parse(stompMessage.body);

        if (messageType === "SYSTEM" && message) {
          setChatMessages((prev) => [
            ...prev,
            {
              messageType: "SYSTEM",
              senderNickname: senderNickname || "System",
              message,
            },
          ]);
        }

        // isHostRef(Authority Guard), isProcessingSync(Infinite Event Loop Guard)
        // ref: updates instantly, useState: updates asynchronously
        const video = videoRef.current;
        if (!video) return;
        // [권한 가드]
        // host의 video player가 자신이 보낸 stomp message에 반응하지 않도록 처리.
        // video가 없거나 본인이 host인 경우, 동기화 로직 실행하지 않고 종료.
        if (senderId === user?.userId) return;

        isProcessingSync.current = true;

        // [이벤트 루프 가드 ON]
        // 1. 코드로 비디오 상태를 변경할 때, 브라우저의 기본 이벤트(onPause, onSeek 등)가 트리거되어
        // 다시 메시지를 보내는 infinite loop을 방지하기 위해 잠금(lock) 설정.
        isProcessingSync.current = true;
        // 2. 비디오 상태 변경 적용 (호스트의 상태와 동기화)
        if (action === "SEEK") {
          video.currentTime = currentTime;
        } else if (action === "PAUSE") {
          video.pause();
          video.currentTime = currentTime; // Sync time even on pause
        } else if (action === "PLAY") {
          video.currentTime = currentTime;
          video.play().catch(() => {});
        }

        // [이벤트 루프 가드 OFF]
        // 비디오 상태 변경 후, 브라우저가 위의 상태 변경 적용을 마치도록 200ms 기다린 후 잠금(lock) 해제.
        setTimeout(() => {
          isProcessingSync.current = false;
        }, 200);
      },
    );

    return () => videoSyncSub.unsubscribe();
  }, [stompClient, isConnected, partyId]);

  // 비디오 조작 이벤트 리스너: 비디오 태그 이벤트 감지
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !stompClient) return;

    // [권한 체크]
    // 호스트 전용 모드인데 내가 호스트가 아니라면, 서버에 이벤트를 보낼 필요가 없으므로 리스너를 등록하지 않음.
    if (hostControl && !isHost) return;

    const onSeeking = () => {
      // 유저가 비디오 시간을 이동하는 동안 발생하는 재생/정지 이벤트들을 무시
      isUserSeeking.current = true;
    };
    const onSeeked = () => {
      handleVideoEvent("SEEK");
      setTimeout(() => {
        isUserSeeking.current = false;
      }, 100);
    };
    const onPlay = () => {
      // 외부에서 주입된 동기화 중이 아니고, 사용자가 탐색 중이 아닐 때만 발송
      if (!isProcessingSync.current && !isUserSeeking.current)
        handleVideoEvent("PLAY");
    };
    const onPause = () => {
      // 외부 동기화 중이 아니고, 탐색 중도 아니며, 비디오 자체가 탐색 중이 아닐 때 발송
      if (!isProcessingSync.current && !video.seeking && !isUserSeeking.current)
        handleVideoEvent("PAUSE");
    };

    video.addEventListener("seeking", onSeeking);
    video.addEventListener("seeked", onSeeked);
    video.addEventListener("play", onPlay);
    video.addEventListener("pause", onPause);

    return () => {
      video.removeEventListener("seeking", onSeeking);
      video.removeEventListener("seeked", onSeeked);
      video.removeEventListener("play", onPlay);
      video.removeEventListener("pause", onPause);
    };

    // partyRoomData.hostControl이나 isHost 상태가 변할 때마다 리스너를 새로 등록/해제함
    // TODO: 파티룸 내에서 HostControl 변경 가능 여부 확인
  }, [hostControl, isHost, stompClient]);

  return { handleVideoEvent };
};
