import { useInfiniteQuery } from "@tanstack/react-query";
import apiClient from "../axios";

export const useFriendSearch = (
  primary: string,
  secondary: string,
  searchWord: string,
) => {
  return useInfiniteQuery({
    queryKey: ["friendship", primary, secondary, searchWord],
    queryFn: async ({ pageParam = 0 }) => {
      const res = await apiClient.get("/friendships", {
        params: {
          primaryFilter: primary,
          secondaryFilter: secondary,
          searchWord: searchWord,
          page: pageParam,
          size: 10,
        },
      });
      return res.data;
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      if (lastPage.last) return undefined;
      return lastPage.number + 1;
    },
  });
};
