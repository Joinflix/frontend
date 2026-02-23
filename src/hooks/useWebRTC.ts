import type { Client } from "@stomp/stompjs";
import { useEffect, useRef, useState } from "react";
import type { User } from "../store/useAuthStore";

interface useWebRTCProps {
  partyId: number | undefined;
  stompClient: Client | null;
  user: User | null;
  isMicActive: boolean;
}

//IceCandidateRequest(BE)
interface IceCandidatePayload {
  candidate: string;
  sdpMid: string | null;
  sdpMLineIndex: number | null;
}

//VoiceSignalRequest(BE)
interface voiceSignalPayload {
  type: "JOIN" | "OFFER" | "ANSWER" | "ICE" | "MUTE_STATUS";
  sdp?: string;
  candidate?: IceCandidatePayload;
  senderId: number;
  senderNickname: string;
  targetId?: number;
  targetNickname?: string;
  isMuted: boolean;
}

export const useWebRTC = ({
  partyId,
  stompClient,
  user,
  isMicActive,
}: useWebRTCProps) => {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);

  // Whenever state updates, sync the ref
  useEffect(() => {
    localStreamRef.current = localStream;
  }, [localStream]);

  const [remoteStreams, setRemoteStreams] = useState<{
    [userId: number]: MediaStream;
  }>({});
  const [muteStatuses, setMuteStatuses] = useState<{
    [userId: number]: boolean;
  }>({});

  const peerConnections = useRef<{ [userId: number]: RTCPeerConnection }>({});
  const pendingCandidates = useRef<{ [userId: number]: RTCIceCandidateInit[] }>(
    {},
  );
  const pendingJoins = useRef<number[]>([]);

  // 마이크 트랙의 enabled 상태를 조절하는 함수
  const toggleLocalMic = () => {
    if (!localStream) return false;

    const audioTrack = localStream.getAudioTracks()[0];
    if (audioTrack) {
      const newEnabledState = !audioTrack.enabled;
      audioTrack.enabled = newEnabledState;

      // 서버에 내 상태 알림
      stompClient?.publish({
        destination: `/pub/party/${partyId}/voice`,
        body: JSON.stringify({
          type: "MUTE_STATUS",
          senderId: user?.userId,
          isMuted: !newEnabledState,
        }),
      });

      return newEnabledState; // 새 상태 반환
    }
    return false;
  };

  // 1-1. 마이크 권한 가져오기 (컴포넌트 마운트 시 한 번만)
  useEffect(() => {
    const getMedia = async () => {
      if (localStream) return; // 이미 있으면 실행 안 함
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: false,
        });

        stream.getAudioTracks().forEach((track) => {
          track.enabled = false;
        });

        setLocalStream(stream);
      } catch (e) {
        console.error("Mic Access Denied", e);
      }
    };

    if (partyId && stompClient?.connected && user) {
      getMedia();
    }
  }, [partyId, stompClient?.connected, user]);

  // handler functions

  //1. create peer connection
  const createPeerConnection = (remoteUserId: number) => {
    if (peerConnections.current[remoteUserId]) {
      return peerConnections.current[remoteUserId];
    }
    const pc = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });

    // Handle ICE candidates
    pc.onicecandidate = (event) => {
      if (event.candidate && partyId) {
        stompClient?.publish({
          destination: `/pub/party/${partyId}/voice`,
          body: JSON.stringify({
            type: "ICE",
            candidate: event.candidate,
            senderId: user?.userId,
            targetId: remoteUserId,
          }),
        });
      }
    };

    // 여기가 핵심!! localStream이 없으면 트랙을 못 보냅니다.
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => {
        pc.addTrack(track, localStreamRef.current!);
      });
    } else {
      console.error("CRITICAL: No localStream available when creating PC!");
    }

    // When remote audio arrives
    pc.ontrack = (event) => {
      setRemoteStreams((prev) => ({
        ...prev,
        [remoteUserId]: event.streams[0],
      }));
    };

    pc.oniceconnectionstatechange = () => {
      if (
        pc.iceConnectionState === "disconnected" ||
        pc.iceConnectionState === "failed" ||
        pc.iceConnectionState === "closed"
      ) {
        setRemoteStreams((prev) => {
          const newState = { ...prev };
          delete newState[remoteUserId];
          return newState;
        });
        pc.close();
        delete peerConnections.current[remoteUserId];
      }
    };

    peerConnections.current[remoteUserId] = pc;
    return pc;
  };

  // 2. When an exiting user hears JOIN signal,
  // (1) they create a PEER CONNECTION
  // (2) and send an OFFER, initiating the call
  const handleJoin = async (payload: voiceSignalPayload) => {
    if (!localStreamRef.current) {
      console.warn("마이크 미준비. 대기 명단에 추가:", payload.senderId);
      pendingJoins.current.push(payload.senderId); // 나중에 마이크 생기면 전화 걸게 저장
      return;
    }
    const pc = createPeerConnection(payload.senderId);
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);

    stompClient?.publish({
      destination: `/pub/party/${partyId}/voice`,
      body: JSON.stringify({
        type: "OFFER",
        sdp: offer.sdp,
        senderId: user?.userId,
        senderNickname: user?.nickname,
        targetId: payload.senderId,
        isMuted: !isMicActive,
      }),
    });
  };

  // 3.
  const handleOffer = async (payload: voiceSignalPayload) => {
    const pc = createPeerConnection(payload.senderId);

    // If we are already processing an offer from this specific person, skip
    if (pc.signalingState !== "stable") return;

    await pc.setRemoteDescription(
      new RTCSessionDescription({ type: "offer", sdp: payload.sdp }),
    );

    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);

    // Flush the waiting room for this user
    const candidates = pendingCandidates.current[payload.senderId] || [];
    for (const candidate of candidates) {
      await pc.addIceCandidate(new RTCIceCandidate(candidate));
    }
    delete pendingCandidates.current[payload.senderId];

    stompClient?.publish({
      destination: `/pub/party/${partyId}/voice`,
      body: JSON.stringify({
        type: "ANSWER",
        sdp: answer.sdp,
        senderId: user?.userId,
        targetId: payload.senderId,
        isMuted: !isMicActive,
      }),
    });
  };

  // 4.
  const handleAnswer = async (payload: voiceSignalPayload) => {
    const pc = peerConnections.current[payload.senderId];
    if (pc) {
      await pc.setRemoteDescription(
        new RTCSessionDescription({ type: "answer", sdp: payload.sdp }),
      );

      // Flush the waiting room for this user
      const candidates = pendingCandidates.current[payload.senderId] || [];
      for (const candidate of candidates) {
        await pc.addIceCandidate(new RTCIceCandidate(candidate));
      }
      delete pendingCandidates.current[payload.senderId];
    }
  };

  // 5.
  const handleIce = async (payload: voiceSignalPayload) => {
    const pc = peerConnections.current[payload.senderId];
    if (!pc || !payload.candidate) return;

    if (pc.remoteDescription) {
      try {
        await pc.addIceCandidate(new RTCIceCandidate(payload.candidate));
      } catch (e) {
        console.error("Error adding ICE candidate", e);
      }
    } else {
      // queue them up
      if (!pendingCandidates.current[payload.senderId]) {
        pendingCandidates.current[payload.senderId] = [];
      }
      pendingCandidates.current[payload.senderId].push(payload.candidate);
    }
  };

  // 1-2. 마이크가 준비되면 JOIN 신호 보내기
  useEffect(() => {
    // localStream이 생겼을 때 딱 한 번만 실행됨
    if (localStream && partyId && stompClient?.connected && user) {
      const joinPayload: voiceSignalPayload = {
        type: "JOIN",
        senderId: user.userId as number,
        senderNickname: user.nickname as string,
        isMuted: !isMicActive,
      };

      stompClient.publish({
        destination: `/pub/party/${partyId}/voice`,
        body: JSON.stringify(joinPayload),
      });

      while (pendingJoins.current.length > 0) {
        const remoteId = pendingJoins.current.shift();
        if (remoteId) {
          handleJoin({
            senderId: remoteId,
            senderNickname: "WaitingUser",
            type: "JOIN",
            isMuted: !isMicActive,
          });
        }
      }
    }
  }, [localStream, stompClient?.connected]); // localStream이 들어왔을 때만 반응

  // 2. SUBSCRIPTION (Listen to signals)
  useEffect(() => {
    if (!partyId || !stompClient?.connected || !user) return;

    const subscription = stompClient.subscribe(
      `/sub/party/${partyId}/voice`,
      (message) => {
        const messageContent: voiceSignalPayload = JSON.parse(message.body);

        // Ignore my own messages
        if (messageContent.senderId === user.userId) return;

        switch (messageContent.type) {
          case "JOIN":
            // Update the status of the person who just joined immediately
            setMuteStatuses((prev) => ({
              ...prev,
              [messageContent.senderId]: messageContent.isMuted,
            }));
            handleJoin(messageContent);
            break;
          case "OFFER":
            // I am the newcomer, someone is offering me their stream.
            // Update the status of the person offering to you
            if (messageContent.targetId === user.userId) {
              setMuteStatuses((prev) => ({
                ...prev,
                [messageContent.senderId]: messageContent.isMuted,
              }));
              handleOffer(messageContent);
            }
            break;
          case "ANSWER":
            // Someone accepted my offer.
            if (messageContent.targetId === user.userId) {
              // Update the status of the person answering you
              setMuteStatuses((prev) => ({
                ...prev,
                [messageContent.senderId]: messageContent.isMuted,
              }));
              handleAnswer(messageContent);
            }
            break;
          case "ICE":
            // Exchanging network info.
            if (messageContent.targetId === user.userId)
              handleIce(messageContent);
            break;
          case "MUTE_STATUS":
            setMuteStatuses((prev) => ({
              ...prev,
              [messageContent.senderId]: messageContent.isMuted,
            }));
            break;
        }
      },
    );

    return () => subscription.unsubscribe();
  }, [partyId, stompClient?.connected, user?.userId]);

  return {
    localStream,
    toggleLocalMic,
    remoteStreams,
    muteStatuses,
    setMuteStatuses,
  };
};
