import { useQuery } from "@tanstack/react-query";
import apiClient from "../axios";

export interface PartyMember {
  userId: number;
  nickname: string;
  email: string;
  isHost: boolean;
  profileImageUrl?: string;
}

export const usePartyMembers = (partyId: number | string | undefined) => {
  return useQuery<PartyMember[]>({
    queryKey: ["memberList", partyId],
    queryFn: async () => {
      if (!partyId) throw new Error("Party ID is required");

      const res = await apiClient.get(`/parties/${partyId}/members`);
      return res.data;
    },
    enabled: !!partyId,
    staleTime: 0,
    refetchOnMount: true,
  });
};
