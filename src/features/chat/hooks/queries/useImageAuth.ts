import { endpoints } from '@/api/endpoints';
import upfetch from '@/api/instance';
import { useQuery } from '@tanstack/react-query';

interface IProps {
  signature: string;
  expire: string;
  token: string;
}

async function queryFn(): Promise<IProps> {
  const data = await upfetch<IProps>(`${endpoints.chatEndpoint.upload}`);
  const { signature, expire, token } = data;
  return { signature, expire, token };
}

export function useImageAuth() {
  return useQuery({
    queryKey: ['image-auth'],
    queryFn,
  });
}
