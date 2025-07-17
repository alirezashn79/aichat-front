import { up } from "up-fetch";

const upfetch = up(fetch, () => ({
  baseUrl: import.meta.env.VITE_PUBLIC_API_URL,
  timeout: 30000,
  credentials: "include" as RequestCredentials,
}));
export default upfetch;
