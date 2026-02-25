import { useMutation, useQuery } from "@tanstack/react-query";
import BrowsingHeader from "../components/browsing/BrowsingHeader";
import apiClient from "../api/axios";
import { LockKeyhole, Play } from "lucide-react";
import BrowsingFooter from "../components/browsing/BrowsingFooter";
import { useNavigate } from "react-router";
import { useState } from "react";

import { FALLBACK_ERROR_MESSAGE } from "../global/const/error";
import type { PartyRoomData } from "../types/party";
import PassCodeOtpModal from "../components/partyroom/PassCodeOtpModal";

const PartyPage = () => {
  const navigate = useNavigate();

  const [selectedPrivateRoomId, setSelectedPrivateRoomId] = useState<
    number | null
  >(null);

  const { data: partyRooms, isPending } = useQuery({
    queryKey: ["getPartyRooms"],
    queryFn: async () => {
      const res = await apiClient.get("/parties");
      return res.data;
    },
  });

  const { mutate: joinParty } = useMutation({
    mutationKey: ["joinParty"],
    mutationFn: async ({
      partyId,
      passCode: otp,
    }: {
      partyId: number;
      passCode?: string;
    }) => {
      const res = await apiClient.post(`/parties/${partyId}/join`, {
        passCode: otp,
      });
      return res.data;
    },
    onSuccess: (data) => {
      navigate(`/watch/party/${data.id}`, {
        state: { partyRoomData: data },
      });
    },
    onError: (err: any) => {
      alert(err.response?.data?.message || FALLBACK_ERROR_MESSAGE);
      if (err.response?.data?.code === "MEMBERSHIP_REQUIRED")
        navigate("/signup/step4-list-membership");
    },
  });

  const handleClickPartyRoom = (partyRoom: PartyRoomData) => {
    if (partyRoom.isPublic) {
      joinParty({ partyId: partyRoom.id });
    } else {
      setSelectedPrivateRoomId(partyRoom.id);
    }
  };

  const handleJoinWithPasscode = (partyId: number, passCode: string) => {
    joinParty({ partyId, passCode });
  };

  return (
    <div className="flex flex-col min-h-screen bg-black">
      <BrowsingHeader />
      <div className="px-10">
        <div className="w-full max-w-6xl mx-auto px-4 mt-30">
          <div className="text-white w-full mb-5 text-3xl font-bold">
            열린 파티
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {!isPending &&
              partyRooms?.content?.map((partyRoom: PartyRoomData) => (
                <div
                  key={partyRoom.id}
                  className="group relative text-white rounded-sm overflow-hidden bg-gray-800 cursor-pointer hover:scale-110 transform transition ease-in-out duration-500"
                  onClick={() => handleClickPartyRoom(partyRoom)}
                >
                  <div className="relative w-full h-32 bg-gray-800 overflow-hidden">
                    <img
                      src={partyRoom.backdrop}
                      alt={partyRoom.movieTitle}
                      className="w-full h-full object-cover rounded-t-sm group-hover:opacity-50 transition-opacity"
                    />

                    {!partyRoom.isPublic && (
                      <div className="absolute inset-0 bg-gray-900/60 flex items-center justify-center group-hover:opacity-0 transition-none">
                        <div className="flex flex-col items-center gap-1">
                          <LockKeyhole
                            className="w-10 h-10 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          />
                          <span className="text-xs text-white font-medium">
                            비공개 파티
                          </span>
                        </div>
                      </div>
                    )}

                    {/* 플레이버튼 */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <div className="bg-[#816BFF] p-3 rounded-full backdrop-blur-sm border-4 border-white">
                        <Play className="w-5 h-5 stroke-3 fill-white" />
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col p-3 gap-y-1">
                    <div className="font-light text-zinc-400 text-xs">
                      {partyRoom.movieTitle}
                    </div>
                    <div className="text-base">{partyRoom.roomName}</div>
                    <div className="flex items-center gap-1 text-xs text-gray-400 mt-2">
                      <div className="rounded-full bg-white w-4 h-4"></div>
                      {partyRoom.hostNickname || "HOST"} |{" "}
                      {partyRoom.currentMemberCount}명 참여 중
                    </div>

                    <div className="absolute bottom-3 right-3 text-[10px] text-zinc-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center">
                      더보기 <span className="ml-1 text-[8px]">▶</span>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      {selectedPrivateRoomId && (
        <PassCodeOtpModal
          selectedPartyId={selectedPrivateRoomId}
          onClose={() => setSelectedPrivateRoomId(null)}
          onJoin={handleJoinWithPasscode}
        />
      )}

      <BrowsingFooter />
    </div>
  );
};

export default PartyPage;
