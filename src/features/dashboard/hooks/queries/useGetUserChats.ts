import { endpoints } from "@/api/endpoints";
import upfetch from "@/api/instance";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@clerk/clerk-react";

export function useGetUserChats() {
  const { getToken } = useAuth();

  return useQuery({
    queryKey: ["user_chats"],
    queryFn: async () => {
      const token = await getToken();

      return upfetch<{ _id: string; title: string }[]>(
        endpoints.dashbardEndpoint.chatList,
        {
          headers: {
            Authorization: `Bearer ${token ?? ""}`,
          },
        }
      );
    },
  });
}
