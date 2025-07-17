import { endpoints } from "@/api/endpoints";
import upfetch from "@/api/instance";
import { useRefresh } from "@/hooks/useRefresh";
import { useAuth } from "@clerk/clerk-react";
import { useMutation } from "@tanstack/react-query";

interface IProps {
  data: {
    question?: string;
    answer: string;
    img?: string;
  };
  chatId: string;
}
interface MutationArgs extends IProps {
  token: string;
}

async function mutationFn({ data, chatId, token }: MutationArgs) {
  return upfetch(`${endpoints.chatEndpoint.chat}/${chatId}`, {
    method: "PUT",
    body: data,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export function usePostChat({ chatId }: { chatId: string }) {
  const refreshChat = useRefresh(["chat", chatId]);
  const { getToken } = useAuth();

  return useMutation({
    mutationFn: async (variables: IProps) => {
      const token = await getToken();
      return mutationFn({ ...variables, chatId, token: token ?? "" });
    },
    onSuccess: async () => {
      refreshChat();
    },
  });
}
