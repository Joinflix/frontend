import { useEffect, useRef } from "react";
import type { PartyRoomData, VideoSyncMessage } from "../types/party";
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
  partyRoomData: PartyRoomData;
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
  partyRoomData,
}: UseVideoSyncProps) => {
  const isRemoteUpdate = useRef(false); // true = this video change was triggered by a remote message, not the local user
  const isHostRef = useRef(isHost);
  const isInitialSyncDone = useRef(false);

  const applyRemoteUpdate = (
    video: HTMLVideoElement,
    action: string,
    currentTime: number,
  ) => {
    isRemoteUpdate.current = true;

    if (action === "SEEK") {
      video.currentTime = currentTime;
      video.addEventListener(
        "seeked",
        () => {
          isRemoteUpdate.current = false;
        },
        { once: true },
      );
    } else if (action === "PAUSE") {
      video.currentTime = currentTime;
      video.addEventListener(
        "seeked",
        () => {
          video.pause();
          video.addEventListener(
            "pause",
            () => {
              isRemoteUpdate.current = false;
            },
            { once: true },
          );
        },
        { once: true },
      );
    } else if (action === "PLAY") {
      video.currentTime = currentTime;
      video.addEventListener(
        "seeked",
        () => {
          video
            .play()
            .then(() => {
              isRemoteUpdate.current = false;
            })
            .catch(() => {
              isRemoteUpdate.current = false;
            });
        },
        { once: true },
      );
    }
  };

  const videoStatus = partyRoomData?.videoStatus;
  const videoCurrentTime = videoStatus?.currentTime;
  const videoPaused = videoStatus?.paused;

  useEffect(() => {
    if (isInitialSyncDone.current || isHost) return;
    if (videoCurrentTime === undefined || videoPaused === undefined) return;

    const interval = setInterval(() => {
      const video = videoRef.current;
      if (!video) return;
      clearInterval(interval);

      const performSync = () => {
        if (isInitialSyncDone.current) return;
        isInitialSyncDone.current = true;
        applyRemoteUpdate(
          video,
          videoPaused ? "PAUSE" : "PLAY",
          videoCurrentTime,
        );
      };

      if (video.readyState >= 1) {
        performSync();
      } else {
        video.addEventListener("loadedmetadata", performSync, { once: true });
      }
    }, 100);

    return () => clearInterval(interval);
  }, [videoCurrentTime, videoPaused, isHost]);

  useEffect(() => {
    isHostRef.current = isHost;
  }, [isHost]);

  const handleVideoEvent = (action: "PLAY" | "PAUSE" | "SEEK") => {
    if (!videoRef.current || isRemoteUpdate.current || !stompClient?.connected)
      return;

    if (hostControl && !isHost) return;

    const state: VideoSyncMessage = {
      currentTime: videoRef.current.currentTime,
      paused: videoRef.current.paused,
      action,
      senderId: user?.userId,
      originalSenderId: user?.userId,
    };

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

  const handleVideoEventRef = useRef(handleVideoEvent);
  useEffect(() => {
    handleVideoEventRef.current = handleVideoEvent;
  });

  useEffect(() => {
    if (!stompClient || !isConnected || !partyId) return;

    const videoSyncSub = stompClient.subscribe(
      `/sub/party/${partyId}/video`,
      (stompMessage: IMessage) => {
        const {
          messageType,
          senderNickname,
          currentTime,
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

        const video = videoRef.current;
        if (!video) return;
        if (senderId === user?.userId) return; // ignore self

        applyRemoteUpdate(video, action, currentTime);
      },
    );

    return () => videoSyncSub.unsubscribe();
  }, [stompClient, isConnected, partyId]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !stompClient) return;
    if (hostControl && !isHost) return;

    const onSeeked = () => {
      if (isRemoteUpdate.current) return;
      handleVideoEventRef.current("SEEK");
    };
    const onPlay = () => {
      if (isRemoteUpdate.current) return;
      handleVideoEventRef.current("PLAY");
    };
    const onPause = () => {
      if (isRemoteUpdate.current || video.seeking) return;
      handleVideoEventRef.current("PAUSE");
    };

    video.addEventListener("seeked", onSeeked);
    video.addEventListener("play", onPlay);
    video.addEventListener("pause", onPause);

    return () => {
      video.removeEventListener("seeked", onSeeked);
      video.removeEventListener("play", onPlay);
      video.removeEventListener("pause", onPause);
    };
  }, [hostControl, isHost, stompClient]);

  return { handleVideoEvent };
};
