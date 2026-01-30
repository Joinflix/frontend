import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosClient from "../axiosClient";

// ===== Types =====
export interface Friend {
  userId: number;
  nickname: string;
  email: string;
}

export interface FriendRequest {
  requestId: number;
  status: "PENDING" | "ACCEPTED";
  senderId: number;
  receiverId: number;
  senderNickname?: string;
  receiverNickname?: string;
  createdAt: string;
}

export interface User {
  id: number;
  email: string;
  nickName: string;
}

// ===== Query Keys =====
const FRIEND_KEYS = {
  all: ["friends"] as const,
  list: () => [...FRIEND_KEYS.all, "list"] as const,
  online: () => [...FRIEND_KEYS.all, "online"] as const,
  incoming: () => [...FRIEND_KEYS.all, "incoming"] as const,
  outgoing: () => [...FRIEND_KEYS.all, "outgoing"] as const,
  users: () => ["users", "all"] as const,
};

// ===== Queries =====

// 친구 목록 조회
export function useFriends() {
  return useQuery({
    queryKey: FRIEND_KEYS.list(),
    queryFn: async () => {
      const res = await axiosClient.get<Friend[]>("/friends");
      return res.data;
    },
  });
}

// 온라인 친구 목록
export function useOnlineFriends() {
  return useQuery({
    queryKey: FRIEND_KEYS.online(),
    queryFn: async () => {
      const res = await axiosClient.get<Friend[]>("/friends/online");
      return res.data;
    },
  });
}

// 받은 친구 요청 목록
export function useIncomingRequests() {
  return useQuery({
    queryKey: FRIEND_KEYS.incoming(),
    queryFn: async () => {
      const res = await axiosClient.get<FriendRequest[]>(
        "/friends/requests/incoming"
      );
      return res.data;
    },
  });
}

// 보낸 친구 요청 목록
export function useOutgoingRequests() {
  return useQuery({
    queryKey: FRIEND_KEYS.outgoing(),
    queryFn: async () => {
      const res = await axiosClient.get<FriendRequest[]>(
        "/friends/requests/outgoing"
      );
      return res.data;
    },
  });
}

// 전체 사용자 목록
export function useAllUsers() {
  return useQuery({
    queryKey: FRIEND_KEYS.users(),
    queryFn: async () => {
      const res = await axiosClient.get<User[]>("/users");
      return res.data;
    },
  });
}

// ===== Mutations =====

// 친구 신청
export function useSendFriendRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (receiverId: number) => {
      const res = await axiosClient.post("/friends/requests", { receiverId });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: FRIEND_KEYS.outgoing() });
      queryClient.invalidateQueries({ queryKey: FRIEND_KEYS.users() });
    },
  });
}

// 요청 수락
export function useAcceptRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (requestId: number) => {
      const res = await axiosClient.post(
        `/friends/requests/${requestId}/accept`
      );
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: FRIEND_KEYS.all });
    },
  });
}

// 요청 거절
export function useRejectRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (requestId: number) => {
      await axiosClient.post(`/friends/requests/${requestId}/reject`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: FRIEND_KEYS.incoming() });
    },
  });
}

// 요청 취소
export function useCancelRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (requestId: number) => {
      await axiosClient.post(`/friends/requests/${requestId}/cancel`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: FRIEND_KEYS.outgoing() });
    },
  });
}

// 친구 삭제
export function useDeleteFriend() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (friendId: number) => {
      await axiosClient.delete(`/friends/${friendId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: FRIEND_KEYS.all });
    },
  });
}
