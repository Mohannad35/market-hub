import { QueryKey } from "@tanstack/react-query";
import { processResponse } from "./process";

// this function is used to fetch the signed in user profile
export async function getProfile({ queryKey }: { queryKey: QueryKey }) {
  const [_key] = queryKey;
  const res = await fetch("/api/user");
  return processResponse(res);
}
