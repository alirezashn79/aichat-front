import { up } from "up-fetch";

const upfetch = up(fetch, () => ({
  baseUrl: "http://localhost:3000/api",
  timeout: 30000,
  credentials: "include" as RequestCredentials,
}));
export default upfetch;
