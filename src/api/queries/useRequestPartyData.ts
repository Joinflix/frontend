import { useQuery } from "@tanstack/react-query";
import apiClient from "../axios";
import type { PartyData } from "../../types/party";

export const useRequestPartyData = (
  partyId: number,
  initialData: PartyData,
) => {
  return useQuery({
    queryKey: ["partyData", partyId],
    queryFn: async () => {
      const res = await apiClient.get(`/parties/${partyId}`);
      return res.data;
    },
    enabled: !!partyId,
    initialData: initialData,
  });
};
