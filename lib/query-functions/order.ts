import { QueryKey } from "@tanstack/react-code";
import { processResponse } from "./process";

export async function getUserOrders({ queryKey }: { queryKey: QueryKey }) {
  const [_key, query] = queryKey;
  const res = await fetch(`/api/order${query ? `?${query}` : ""}`);
  return processResponse(res);
}

export async function getOrder({ queryKey }: { queryKey: QueryKey }) {
  const [_key, code] = queryKey;
  const res = await fetch(`/api/order/${code}`);
  return processResponse(res);
}
