import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import apiClient from "../axios";
import { FALLBACK_ERROR_MESSAGE } from "../../global/const/error";

interface JoinPartyParams {
  partyId: number;
  passCode?: string | null;
}

export const useJoinParty = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async ({ partyId, passCode }: JoinPartyParams) => {
      const res = await apiClient.post(`/parties/${partyId}/join`, {
        passCode,
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
    },
  });
};
