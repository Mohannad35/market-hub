import { QueryKey } from "@tanstack/react-query";
import { processResponse } from "./process";

export async function getUserOrders({ queryKey }: { queryKey: QueryKey }) {
  const [_key, query] = queryKey;
  const res = await fetch(`/api/order${query ? `?${query}` : ""}`);
  return processResponse(res);
}
