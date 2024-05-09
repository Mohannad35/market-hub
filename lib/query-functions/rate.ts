import { QueryKey } from "@tanstack/react-query";
import { processResponse } from "./process";

export async function getRate({ queryKey }: { queryKey: QueryKey }) {
  const [_key, productId] = queryKey;
  const res = await fetch(`/api/rate?productId=${productId}`);
  return processResponse(res);
}

export async function getRatingStats({ queryKey }: { queryKey: QueryKey }) {
  const [_key, productSlug] = queryKey;
  const res = await fetch(`/api/rates/stats?productSlug=${productSlug}`);
  return processResponse(res);
}
