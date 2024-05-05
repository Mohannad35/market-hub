import { QueryKey } from "@tanstack/react-query";

export async function getRate({ queryKey }: { queryKey: QueryKey }) {
  const [_key, productId] = queryKey;
  const res = await fetch(`/api/rate?productId=${productId}`);
  if (res.ok) return await res.json();
  else if (res.status >= 400 && res.status < 500)
    throw new Error((await res.json()).message || res.statusText);
  else throw new Error("A server error occurred");
}

export async function getRatingStats({ queryKey }: { queryKey: QueryKey }) {
  const [_key, productSlug] = queryKey;
  const res = await fetch(`/api/rates/stats?productSlug=${productSlug}`);
  if (res.ok) return await res.json();
  else if (res.status >= 400 && res.status < 500)
    throw new Error((await res.json()).message || res.statusText);
  else throw new Error("A server error occurred");
}
