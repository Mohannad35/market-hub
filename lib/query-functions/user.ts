import { QueryKey } from "@tanstack/react-query";
import { processResponse } from "./process";

// this function is used to fetch the signed in user profile
export async function getProfile({ queryKey }: { queryKey: QueryKey }) {
  const [_key, username] = queryKey;
  let res: Response;
  if (username) res = await fetch(`/api/user/${username}`);
  else res = await fetch("/api/user");
  return processResponse(res);
}
