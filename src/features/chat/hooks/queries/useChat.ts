import { endpoints } from '@/api/endpoints';
import upfetch from '@/api/instance';
import { useQuery } from '@tanstack/react-query';
interface IChat {
  _id: string;
  userId: string;
  history: Array<{
    role: 'user' | 'model';
    parts: [{ _id: string; text: string }];
    img: string;
  }>;
}
async function queryFn({ queryKey }: { queryKey: string[] }) {
  const chatId = queryKey[1];
  return upfetch<IChat>(`${endpoints.chatEndpoint.chat}/${chatId}`);
}

export function useChat({ chatId }: { chatId: string }) {
  return useQuery({
    queryKey: ['chat', chatId],
    queryFn,
  });
}
