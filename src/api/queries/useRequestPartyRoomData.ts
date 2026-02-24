import { useQuery } from "@tanstack/react-query";
import apiClient from "../axios";
import type { PartyRoomData } from "../../types/party";

export const useRequestPartyRoomData = (
  partyId: number | undefined,
  initialData: PartyRoomData,
) => {
  return useQuery({
    queryKey: ["partyRoomData", partyId],
    queryFn: async () => {
      const res = await apiClient.get(`/parties/${partyId}`);
      return res.data;
    },
    enabled: !!partyId && !isNaN(partyId),
    initialData: initialData,
  });
};
