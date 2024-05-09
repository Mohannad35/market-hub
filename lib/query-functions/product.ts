import { QueryKey } from "@tanstack/react-query";
import { processResponse } from "./process";

export async function getProduct({ queryKey }: { queryKey: QueryKey }) {
  const [_key, slug, pop] = queryKey;
  const populate = `${pop ? pop : "brand,category,rates"}`;
  const res = await fetch(`/api/products/${slug}?populate=${populate}`);
  return processResponse(res);
}

export async function getRelatedProducts({ queryKey }: { queryKey: QueryKey }) {
  const [_key, parent] = queryKey;
  const res = await fetch(`/api/products?category=${parent}`);
  return processResponse(res);
}

export async function getProductsYouMayLike({ queryKey }: { queryKey: QueryKey }) {
  const [_key, brand] = queryKey;
  const res = await fetch(`/api/products?brands=${brand}`);
  return processResponse(res);
}
