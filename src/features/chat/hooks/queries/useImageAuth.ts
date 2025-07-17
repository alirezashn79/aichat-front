import { endpoints } from "@/api/endpoints";
import upfetch from "@/api/instance";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@clerk/clerk-react";

interface IProps {
  signature: string;
  expire: string;
  token: string;
}

export function useImageAuth() {
  const { getToken } = useAuth();

  return useQuery({
    queryKey: ["image-auth"],
    queryFn: async (): Promise<IProps> => {
      const token = await getToken();
      const data = await upfetch<IProps>(`${endpoints.chatEndpoint.upload}`, {
        headers: {
          Authorization: `Bearer ${token ?? ""}`,
        },
      });
      const { signature, expire, token: imageToken } = data;
      return { signature, expire, token: imageToken };
    },
  });
}
