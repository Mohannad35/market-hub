import { QueryKey } from "@tanstack/react-query";
import { processResponse } from "./process";

export async function getRate({ queryKey }: { queryKey: QueryKey }) {
  const [_key, productId, productSlug] = queryKey;
  const query = productSlug ? `productSlug=${productSlug}` : `productId=${productId}`;
  const res = await fetch(`/api/rate?${query}`);
  return processResponse(res);
}

export async function getRatingStats({ queryKey }: { queryKey: QueryKey }) {
  const [_key, productSlug] = queryKey;
  const res = await fetch(`/api/rates/stats?productSlug=${productSlug}`);
  return processResponse(res);
}
