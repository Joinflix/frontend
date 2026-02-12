import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "../../api/axios";

export const useFriendActions = (
  setPendingRequestIds?: React.Dispatch<React.SetStateAction<Set<number>>>,
) => {
  const queryClient = useQueryClient();

  const invalidateUsers = () => {
    queryClient.invalidateQueries({ queryKey: ["users"], type: "active" });
  };

  const requestFriendMutation = useMutation({
    mutationFn: async (receiverId: number) => {
      setPendingRequestIds?.((prev) => new Set(prev).add(receiverId));
      const res = await apiClient.post("/friends/requests", { receiverId });
      return res.data;
    },
    onError: (err, receiverId) => {
      setPendingRequestIds?.((prev) => {
        const next = new Set(prev);
        next.delete(receiverId);
        return next;
      });
    },
  });

  const removeFriendMutation = useMutation({
    mutationFn: async (requestId: number) => {
      const res = await apiClient.delete(`/friends/${requestId}`);
      return res.data;
    },
    onSuccess: invalidateUsers,
  });

  const acceptFriendMutation = useMutation({
    mutationFn: async (requestId: number) => {
      const res = await apiClient.post(`/friends/requests/${requestId}/accept`);
      return res.data;
    },
    onSuccess: invalidateUsers,
  });

  const refuseFriendMutation = useMutation({
    mutationFn: async (requestId: number) => {
      const res = await apiClient.post(`/friends/requests/${requestId}/reject`);
      return res.data;
    },
    onSuccess: invalidateUsers,
  });

  return {
    requestFriend: requestFriendMutation.mutateAsync,
    removeFriend: removeFriendMutation.mutateAsync,
    acceptFriend: acceptFriendMutation.mutateAsync,
    refuseFriend: refuseFriendMutation.mutateAsync,
    isAdding: requestFriendMutation.isPending,
  };
};
