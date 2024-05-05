import { QueryKey } from "@tanstack/react-query";

export async function getProduct({ queryKey }: { queryKey: QueryKey }) {
  const [_key, slug] = queryKey;
  const res = await fetch(`/api/products/${slug}?populate=brand,category,rates`);
  if (res.ok) return await res.json();
  else if (res.status >= 400 && res.status < 500)
    throw new Error((await res.json()).message || res.statusText);
  else throw new Error("A server error occurred");
}
