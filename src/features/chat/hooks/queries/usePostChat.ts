import { endpoints } from '@/api/endpoints';
import upfetch from '@/api/instance';
import { useRefresh } from '@/hooks/useRefresh';
import { useMutation } from '@tanstack/react-query';

interface IProps {
  data: {
    question?: string;
    answer: string;
    img?: string;
  };
  chatId: string;
}

async function mutationFn({ data, chatId }: IProps) {
  return upfetch(`${endpoints.chatEndpoint.chat}/${chatId}`, {
    method: 'PUT',
    body: data,
  });
}

export function usePostChat({ chatId }: { chatId: string }) {
  const refreshChat = useRefresh(['chat', chatId]);

  return useMutation({
    mutationFn,
    onSuccess: async () => {
      refreshChat();
    },
  });
}
