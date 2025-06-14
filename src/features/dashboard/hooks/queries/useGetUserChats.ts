import { endpoints } from '@/api/endpoints';
import upfetch from '@/api/instance';
import { useQuery } from '@tanstack/react-query';

async function queryFn() {
  return await upfetch<{ _id: string; title: string }[]>(
    endpoints.dashbardEndpoint.chatList,
  );
}

export function useGetUserChats() {
  return useQuery({
    queryKey: ['user_chats'],
    queryFn,
  });
}
