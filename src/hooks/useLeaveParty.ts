import { useNavigate } from "react-router";
import { useQueryClient } from "@tanstack/react-query";
import type { Client } from "@stomp/stompjs";

interface UseLeavePartyProps {
  partyId: number | string | undefined;
  stompClient: Client | null;
  accessToken: string | null;
}

export const useLeaveParty = ({
  partyId,
  stompClient,
  accessToken,
}: UseLeavePartyProps) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const leaveParty = (newHostId?: number) => {
    if (stompClient?.connected) {
      stompClient.publish({
        destination: `/pub/party/${partyId}/leave`,
        body: JSON.stringify({ targetMemberId: newHostId }),
        headers: { Authorization: accessToken ? accessToken : "" },
      });
    }

    // 파티 페이지로 이동
    navigate("/party", { replace: true });

    setTimeout(() => {
      queryClient.invalidateQueries({ queryKey: ["getPartyRooms"] });
    }, 300);
  };

  return { leaveParty };
};
