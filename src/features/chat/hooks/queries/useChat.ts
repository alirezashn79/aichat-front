import { endpoints } from "@/api/endpoints";
import upfetch from "@/api/instance";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@clerk/clerk-react";

interface IChat {
  _id: string;
  userId: string;
  history: Array<{
    role: "user" | "model";
    parts: [{ _id: string; text: string }];
    img: string;
  }>;
}

export function useChat({ chatId }: { chatId: string }) {
  const { getToken } = useAuth();

  return useQuery({
    queryKey: ["chat", chatId],
    queryFn: async () => {
      const token = await getToken();
      return upfetch<IChat>(`${endpoints.chatEndpoint.chat}/${chatId}`, {
        headers: {
          Authorization: `Bearer ${token ?? ""}`,
        },
      });
    },
  });
}
