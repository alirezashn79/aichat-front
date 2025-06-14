import upfetch from '@/api/instance';
import { useQuery } from '@tanstack/react-query';

async function queryFn() {
  return upfetch(`/todos`);
}

export function useTest() {
  return useQuery({
    queryKey: ['chat'],
    queryFn,
  });
}
