import { useEffect, useRef, useState } from "react";
import ChatWindow from "../components/partyroom/chat/ChatWindow";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Mic,
  MicOff,
} from "lucide-react";
import { useLocation, useNavigate, useParams } from "react-router";
import { useWebSocketStore } from "../store/useWebSocketStore";
import { useAuthStore } from "../store/useAuthStore";
import { useQuery } from "@tanstack/react-query";
import apiClient from "../api/axios";

const chevronStyle = "stroke-zinc-600 stroke-5";
interface ChatMessage {
  messageType: "TALK" | "ENTER" | "LEAVE" | "SYSTEM";
  sender: string;
  message: string;
  currentCount?: number;
}
interface VideoState {
  currentTime: number;
  paused: boolean;
  action: "PLAY" | "PAUSE" | "SEEK";
}

const PartyRoomPage = () => {
  const navigate = useNavigate();
  const { partyId } = useParams();
  const location = useLocation();

  const [isChatMinimized, setIsChatMinimized] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const stompClient = useWebSocketStore((state) => state.stompClient);
  const [liveCount, setLiveCount] = useState<number | null>(null);
  const [isPartyClosed, setIsPartyClosed] = useState(false);

  const [showLeaveDialog, setShowLeaveDialog] = useState(false);
  const [isDelegating, setIsDelegating] = useState(false);
  const [memberList, setMemberList] = useState<
    { userId: string; nickname: string }[]
  >([]);
  const [isLoadingMembers, setIsLoadingMembers] = useState(false);
  const hasLeftManually = useRef(false);

  const localAudioStreamRef = useRef<MediaStream | null>(null);
  const peerConnections = useRef<{ [key: string]: RTCPeerConnection }>({});
  const [isVoiceActive, setIsVoiceActive] = useState(false);

  const handleSignalingDataRef = useRef<(data: any) => Promise<void>>();
  const createPeerConnectionRef =
    useRef<(nickname: string) => RTCPeerConnection>();

  const peerConfiguration: RTCConfiguration = {
    iceServers: [{ urls: ["stun:stun.l.google.com:19302"] }],
  };

  const accessToken = useAuthStore((state) => state.accessToken);
  const isConnected = useWebSocketStore((state) => state.isConnected);
  const user = useAuthStore((state) => state.user);

  const [remoteUsers, setRemoteUsers] = useState<{
    [nickname: string]: {
      stream: MediaStream;
      isMuted: boolean;
      volume: number;
    };
  }>({});

  const { data: queryPartyData, isPending: isPendingQueryPartyData } = useQuery(
    {
      queryKey: ["queryPartyData", partyId],
      queryFn: async () => {
        const res = await apiClient.get(`/parties/${partyId}`);
        return res.data;
      },
      enabled: !!partyId && !location.state?.partyData,
    },
  );
  const finalPartyData = location.state?.partyData || queryPartyData;

  const videoRef = useRef<HTMLVideoElement>(null);
  const isProcessingSync = useRef(false);

  const isHost =
    finalPartyData && user
      ? String(finalPartyData.hostNickname) === String(user.nickName)
      : false;
  const isHostRef = useRef(isHost);

  const [isHostControl, setIsHostControl] = useState(true);

  useEffect(() => {
    isHostRef.current = isHost;
  }, [isHost]);

  useEffect(() => {
    if (finalPartyData) {
      console.log("Party Data Loaded. Host ID:", finalPartyData.hostId);
      console.log("Current User ID:", user?.userId);
      console.log("Is Host?:", isHost);
    }
  }, [finalPartyData, user, isHost]);

  const [videoState, setVideoState] = useState({
    currentTime: 0,
    paused: true,
  });

  const chatWidth = 336;
  const handleWidth = 32;

  useEffect(() => {
    if (!stompClient || !isConnected || !partyId) return;

    // Subscribe to Chat/Events
    const partySub = stompClient.subscribe(
      `/sub/party/${partyId}`,
      (message) => {
        const newMessage = JSON.parse(message.body);

        if (newMessage.messageType === "LEAVE") {
          const leavingNickname = newMessage.sender;
          console.log(`${leavingNickname} has left. Cleaning up connection...`);

          // 1. Close and remove the Peer Connection
          if (peerConnections.current[leavingNickname]) {
            peerConnections.current[leavingNickname].close();
            delete peerConnections.current[leavingNickname];
          }

          // 2. Remove from remoteUsers UI state
          setRemoteUsers((prev) => {
            const newState = { ...prev };
            delete newState[leavingNickname];
            return newState;
          });
        }

        if (
          newMessage.messageType === "ENTER" &&
          newMessage.sender !== user?.nickName
        ) {
          console.log(
            "New member detected. Initiating call to:",
            newMessage.sender,
          );
          initiateCall(newMessage.sender);
        }

        if (newMessage.currentCount !== undefined)
          setLiveCount(newMessage.currentCount);
        setMessages((prev) => [...prev, newMessage]);
      },
    );

    const initiateCall = async (remoteNickname: string) => {
      if (!localAudioStreamRef.current) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({
            audio: true,
          });
          localAudioStreamRef.current = stream;
          stream.getAudioTracks()[0].enabled = false;
        } catch (err) {
          console.warn("Could not get mic before initiating call:", err);
        }
      }

      // 1. Create the connection
      const pc = createPeerConnection(remoteNickname);

      // 2. Create the Offer
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      // 3. Send the offer via signaling
      stompClient?.publish({
        destination: `/pub/party/${partyId}/voice`,
        body: JSON.stringify({
          type: "offer",
          sdp: offer.sdp,
          sender: user?.nickName,
          target: remoteNickname, // Optional: tell signaling who this is for
        }),
      });

      // Tell the new joiner your current mute state immediately
      const audioTrack = localAudioStreamRef.current?.getAudioTracks()[0];
      stompClient?.publish({
        destination: `/pub/party/${partyId}/voice`,
        body: JSON.stringify({
          type: "mute-status",
          sender: user?.nickName,
          target: remoteNickname, // only they need this
          isMuted: audioTrack ? !audioTrack.enabled : true,
        }),
      });
    };

    // Subscribe to Video Sync
    const videoSub = stompClient.subscribe(
      `/sub/party/${partyId}/video`,
      (msg) => {
        const { currentTime, paused, action } = JSON.parse(msg.body);
        const video = videoRef.current;
        if (!video || isHostRef.current) return;
        isProcessingSync.current = true; // Lock local events
        if (action === "SEEK") {
          video.currentTime = currentTime;
        } else {
          video.currentTime = currentTime;
          if (paused) video.pause();
          else video.play().catch(() => {});
        }
        setTimeout(() => {
          isProcessingSync.current = false;
        }, 200);
      },
    );

    stompClient.publish({
      destination: `/pub/party/${partyId}/enter`,
      headers: {
        Authorization: accessToken?.startsWith("Bearer ")
          ? accessToken
          : `Bearer ${accessToken}`,
      },
    });

    // Listen for WebRTC Signaling (Offers, Answers, ICE Candidates)
    const voiceSub = stompClient.subscribe(
      `/sub/party/${partyId}/voice`,
      (msg) => {
        const data = JSON.parse(msg.body);
        // Ignore messages from yourself
        if (data.sender === user?.nickName) return;

        handleSignalingDataRef.current?.(data);
      },
    );

    return () => {
      partySub.unsubscribe();
      videoSub.unsubscribe();
      voiceSub.unsubscribe();

      // Clean up all Peer Connections
      Object.values(peerConnections.current).forEach((pc) => pc.close());
      peerConnections.current = {};

      // Stop your own microphone track
      if (localAudioStreamRef.current) {
        localAudioStreamRef.current
          .getTracks()
          .forEach((track) => track.stop());
        localAudioStreamRef.current = null;
      }
    };
  }, [stompClient, isConnected, partyId, user]);

  useEffect(() => {
    if (isConnected && stompClient && user) {
      const audioTrack = localAudioStreamRef.current?.getAudioTracks()[0];
      const currentMuteState = audioTrack ? !audioTrack.enabled : true;

      stompClient.publish({
        destination: `/pub/party/${partyId}/voice`,
        body: JSON.stringify({
          type: "mute-status",
          sender: user.nickName,
          // No target means it's a broadcast to all existing participants
          isMuted: currentMuteState,
        }),
      });
    }
  }, [isConnected, stompClient, partyId, user]);

  // 3. WebRTC Logic Functions
  const startVoiceChat = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      localAudioStreamRef.current = stream;
      setIsVoiceActive(true);

      // In a Mesh network, you'd now create an offer for everyone in memberList
      // For now, let's initialize the connection logic
      console.log("Voice stream started");
    } catch (err) {
      console.error("Mic access denied", err);
    }
  };

  const handleSignalingData = async (data: any) => {
    const { type, sdp, candidate, sender, target, isMuted } = data;

    if (type === "mute-status") {
      if (target && target !== user?.nickName) return;
      setRemoteUsers((prev) => {
        const existing = prev[sender];

        return {
          ...prev,
          [sender]: {
            stream: existing?.stream ?? null,
            volume: existing?.volume ?? 1.0,
            isMuted: isMuted ?? true,
          },
        };
      });
      return;
    }

    // Find or create the peer connection for this specific sender
    let pc = peerConnections.current[sender];

    if (type === "offer") {
      pc = createPeerConnection(sender);
      await pc.setRemoteDescription(new RTCSessionDescription({ type, sdp }));
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);

      stompClient?.publish({
        destination: `/pub/party/${partyId}/voice`,
        body: JSON.stringify({
          type: "answer",
          sdp: answer.sdp,
          sender: user?.nickName,
          target: sender,
        }),
      });

      // Send YOUR mute state back to the person who just called you
      const audioTrack = localAudioStreamRef.current?.getAudioTracks()[0];
      stompClient?.publish({
        destination: `/pub/party/${partyId}/voice`,
        body: JSON.stringify({
          type: "mute-status",
          sender: user?.nickName,
          target: sender, // send only to the person who initiated the call
          isMuted: audioTrack ? !audioTrack.enabled : true,
        }),
      });
    } else if (type === "answer" && pc) {
      if (target && target !== user?.nickName) return;
      await pc.setRemoteDescription(new RTCSessionDescription({ type, sdp }));
    } else if (type === "candidate" && pc) {
      if (target && target !== user?.nickName) return;
      await pc.addIceCandidate(new RTCIceCandidate(candidate));
    }
  };
  handleSignalingDataRef.current = handleSignalingData;

  const createPeerConnection = (remoteNickname: string) => {
    const pc = new RTCPeerConnection(peerConfiguration);

    if (localAudioStreamRef.current) {
      localAudioStreamRef.current.getTracks().forEach((track) => {
        pc.addTrack(track, localAudioStreamRef.current!);
      });
    }

    pc.ontrack = (event) => {
      const remoteStream = event.streams[0];
      setRemoteUsers((prev) => ({
        ...prev,
        [remoteNickname]: {
          stream: remoteStream,
          isMuted: prev[remoteNickname]?.isMuted ?? true,
          volume: prev[remoteNickname]?.volume ?? 1.0,
        },
      }));
    };

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        stompClient?.publish({
          destination: `/pub/party/${partyId}/voice`,
          body: JSON.stringify({
            type: "candidate",
            candidate: event.candidate,
            sender: user?.nickName,
            target: remoteNickname,
          }),
        });
      }
    };

    peerConnections.current[remoteNickname] = pc;
    return pc;
  };
  createPeerConnectionRef.current = createPeerConnection;

  const handleClickOut = () => {
    if (isHost) {
      // TODO: 친구 목록 불러오기
      setShowLeaveDialog(true);
    } else {
      performLeave();
    }
  };

  const performLeave = (newHostId?: string) => {
    hasLeftManually.current = true;
    if (stompClient?.connected) {
      stompClient.publish({
        destination: `/pub/party/${partyId}/leave`,
        body: JSON.stringify({ nextHostId: newHostId }), // Send delegation if exists
        headers: { Authorization: accessToken },
      });
    }
    navigate(-1);
  };

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isHost) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isHost]);

  const handleFetchMembers = async () => {
    setIsLoadingMembers(true);
    try {
      const res = await apiClient.get(`/parties/${partyId}/members`);
      const currentUserNickname = useAuthStore.getState().user?.nickName;
      const others = res.data.filter(
        (m: any) => m.userNickname !== currentUserNickname,
      );
      if (others.length === 0) {
        setMemberList([]);
      } else {
        setMemberList(others);
      }
      setIsDelegating(true);
    } catch (error) {
      console.error("Failed to load members", error);
      alert("멤버 목록을 불러오지 못했습니다.");
    } finally {
      setIsLoadingMembers(false);
    }
  };

  const sendChat = (text: string) => {
    if (stompClient?.connected) {
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

  const handleVideoEvent = (action: "PLAY" | "PAUSE" | "SEEK") => {
    if (
      !videoRef.current ||
      isProcessingSync.current ||
      !stompClient?.connected
    )
      return;
    const state: VideoState = {
      currentTime: videoRef.current.currentTime,
      paused: videoRef.current.paused,
      action: action,
    };

    // Only send if allowed
    if (!isHostControl || isHost) {
      stompClient?.publish({
        destination: `/pub/party/${partyId}/video`,
        body: JSON.stringify(state),
        headers: {
          Authorization: accessToken?.startsWith("Bearer ")
            ? accessToken
            : `Bearer ${accessToken}`,
        },
      });
    } else if (!isHostControl) {
      // everyone can control
      stompClient?.publish({
        destination: `/pub/party/${partyId}/video`,
        body: JSON.stringify(state),
        headers: {
          Authorization: accessToken?.startsWith("Bearer ")
            ? accessToken
            : `Bearer ${accessToken}`,
        },
      });
    }
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const onPlay = () => handleVideoEvent("PLAY");
    const onPause = () => {
      if (!video.seeking) {
        handleVideoEvent("PAUSE");
      }
    };
    const onSeek = () => handleVideoEvent("SEEK");
    video.addEventListener("play", onPlay);
    video.addEventListener("pause", onPause);
    video.addEventListener("seeked", onSeek);
    return () => {
      video.removeEventListener("play", onPlay);
      video.removeEventListener("pause", onPause);
      video.removeEventListener("seeked", onSeek);
    };
  }, [isHostControl, isHost, stompClient]);

  const displayCount = liveCount ?? finalPartyData?.currentMemberCount ?? 0;

  // Place this right before your main return
  if (isPendingQueryPartyData && !finalPartyData) {
    return (
      <div className="h-screen w-full bg-black flex flex-col items-center justify-center text-white gap-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#816BFF]"></div>
        <p className="animate-pulse text-zinc-400">
          파티룸 정보를 가져오는 중...
        </p>
      </div>
    );
  }

  // Second safety guard: if data fails to load or doesn't exist
  if (!finalPartyData) {
    return (
      <div className="h-screen w-full bg-black flex items-center justify-center text-white">
        <p>파티를 찾을 수 없습니다.</p>
        <button onClick={() => navigate(-1)} className="ml-4 underline">
          돌아가기
        </button>
      </div>
    );
  }

  const onToggleVoice = async () => {
    try {
      // 1. If no stream exists, start it
      if (!localAudioStreamRef.current) {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        localAudioStreamRef.current = stream;

        // Ensure the track is ON when first started
        stream.getAudioTracks()[0].enabled = true;
        setIsVoiceActive(true);

        // Attach to any existing peer connections
        Object.values(peerConnections.current).forEach((pc) => {
          stream.getTracks().forEach((track) => {
            pc.addTrack(track, stream);
          });
        });

        return; // Exit after initializing
      }

      // 2. If stream exists, toggle the 'enabled' property
      const audioTrack = localAudioStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        const nextState = !audioTrack.enabled;
        audioTrack.enabled = nextState; // This is the actual "Mute/Unmute" line
        setIsVoiceActive(nextState);

        stompClient?.publish({
          destination: `/pub/party/${partyId}/voice`,
          body: JSON.stringify({
            type: "mute-status",
            sender: user?.nickName,
            isMuted: !nextState,
          }),
        });
      }
    } catch (err) {
      console.error("Mic toggle error:", err);
      // Optional: Alert the user if they blocked the mic
      setIsVoiceActive(false);
    }
  };

  return (
    <div className="flex h-screen relative">
      {/* Video */}
      <div className="flex-1 flex items-center justify-center bg-black text-white transition-all duration-300">
        <div className="absolute top-4 left-4 z-10  px-3 py-1 ">
          <div className="flex items-center gap-1">
            <ArrowLeft
              size={20}
              className="cursor-pointer top-4 left-4 z-10 hover:scale-120 transition-transform stroke-3"
              onClick={handleClickOut}
            />
            <span className="pointer-events-none">
              {finalPartyData.movieTitle}
            </span>
          </div>
        </div>
        <video
          ref={videoRef}
          src="https://joinflix-s3-bucket.s3.ap-northeast-2.amazonaws.com/videos/steamboat-willie_1928.mp4"
          className="object-contain w-full h-full max-h-screen max-w-screen"
          controls={!isHostControl || isHost}
        />

        {/* Floating Voice Control */}
        {isChatMinimized && (
          <div className="absolute top-6 right-6 z-30 flex flex-col items-center gap-2 group">
            <button
              onClick={onToggleVoice}
              className={`
              group relative flex h-7 w-7 items-center justify-center rounded-full 
              border border-white/10 shadow-2xl transition-all duration-300 
              hover:scale-110 active:scale-95 cursor-pointer ring-4 ring-[#816BFF]/20
              ${isVoiceActive ? "bg-[#816BFF] text-white" : "bg-zinc-800 text-zinc-500"}
            `}
            >
              {isVoiceActive && (
                <div className="absolute inset-0 rounded-full animate-ping bg-[#816BFF]/40" />
              )}

              {isVoiceActive ? (
                <Mic className="size-4" />
              ) : (
                <MicOff className="size-4" />
              )}
            </button>

            {/* tooltip */}
            <span className="absolute top-0.5 right-9 px-2 py-1 text-xs text-white bg-black/80 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              {isVoiceActive ? "클릭해서 마이크 끄기" : "클릭해서 마이크 켜기"}
            </span>
          </div>
        )}
      </div>

      {/* Chat */}
      <div
        className="flex flex-col h-full bg-zinc-900 transition-all duration-300"
        style={{ width: isChatMinimized ? 0 : chatWidth }}
      >
        <ChatWindow
          messages={messages}
          onSendMessage={sendChat}
          partyData={finalPartyData}
          currentCount={displayCount}
          isVoiceActive={isVoiceActive}
          onToggleVoice={onToggleVoice}
          remoteUsers={remoteUsers}
          setRemoteUsers={setRemoteUsers}
          localStream={localAudioStreamRef.current}
        />
      </div>

      {/* Handle */}
      <div
        className="absolute top-1/2 transform -translate-y-1/2 w-8 h-15 flex items-center justify-center rounded-l-lg cursor-pointer bg-zinc-900 z-20"
        onClick={() => setIsChatMinimized((prev) => !prev)}
        style={{
          // Move handle: right edge of chat if expanded, right screen edge if minimized
          right: isChatMinimized ? 0 : chatWidth,
          transition: "right 0.3s",
        }}
      >
        {isChatMinimized ? (
          <ChevronLeft className={chevronStyle} />
        ) : (
          <ChevronRight className={chevronStyle} />
        )}
      </div>
      {/* Party Closed Overlay */}
      {isPartyClosed && (
        <div className="absolute inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md">
          <div className="text-center p-8 bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl">
            <h2 className="text-2xl font-bold text-white mb-2">
              방장이 파티를 종료했습니다.
            </h2>
            <p className="text-zinc-400 mb-6">the host has closed this party</p>
            <button
              onClick={() => navigate("/party", { replace: true })}
              className="px-6 py-2 bg-[#816BFF] text-white rounded-lg font-medium hover:bg-[#6c56e0] transition-colors cursor-pointer"
            >
              목록으로 돌아가기
            </button>
          </div>
        </div>
      )}

      {/* Leave Options Modal */}
      {showLeaveDialog && (
        <div className="absolute inset-0 z-[110] flex items-center justify-center bg-black/80 backdrop-blur-sm px-4">
          <div className="bg-zinc-900 border border-zinc-800 w-full max-w-sm rounded-2xl p-6 shadow-2xl">
            {!isDelegating ? (
              <>
                <h3 className="text-xl font-bold text-white mb-2">
                  파티 나가기
                </h3>
                <p className="text-zinc-400 text-sm mb-6">
                  방장 권한을 위임하거나 파티를 종료할 수 있습니다.
                </p>

                <div className="flex flex-col gap-3">
                  <button
                    onClick={handleFetchMembers}
                    disabled={isLoadingMembers}
                    className="w-full py-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl transition-all font-medium disabled:opacity-50"
                  >
                    {isLoadingMembers ? "로딩 중..." : "권한 위임 후 나가기"}
                  </button>
                  <button
                    onClick={() => performLeave()} // No ID passed = Backend closes party
                    className="w-full py-3 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-xl transition-all font-medium border border-red-500/10"
                  >
                    파티 종료 (모두 퇴장)
                  </button>
                  <button
                    onClick={() => setShowLeaveDialog(false)}
                    className="mt-2 py-2 text-zinc-500 hover:text-zinc-300 text-sm"
                  >
                    취소
                  </button>
                </div>
              </>
            ) : (
              <>
                <h3 className="text-xl font-bold text-white mb-4">
                  새 방장 선택
                </h3>
                <div className="max-h-60 overflow-y-auto mb-6 flex flex-col gap-2 pr-1 custom-scrollbar">
                  {memberList.length > 0 ? (
                    memberList.map((member) => (
                      <button
                        key={member.userId}
                        onClick={() => performLeave(member.userId)}
                        className="w-full flex items-center gap-3 p-3 rounded-xl bg-zinc-800/50 hover:bg-[#816BFF]/20 border border-transparent hover:border-[#816BFF]/50 transition-all text-left group"
                      >
                        <div className="w-8 h-8 rounded-full bg-zinc-700 group-hover:bg-[#816BFF] flex items-center justify-center text-xs text-white transition-colors">
                          {member.nickname?.charAt(0)}
                        </div>
                        <span className="text-white font-medium">
                          {member.nickname}
                        </span>
                      </button>
                    ))
                  ) : (
                    <p className="text-zinc-500 text-center py-4 text-sm">
                      위임할 수 있는 멤버가 없습니다.
                    </p>
                  )}
                </div>
                <button
                  onClick={() => setIsDelegating(false)}
                  className="w-full py-2 text-zinc-400 hover:text-white transition-colors text-sm"
                >
                  뒤로 가기
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PartyRoomPage;
