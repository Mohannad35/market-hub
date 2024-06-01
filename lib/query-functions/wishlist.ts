import { QueryKey } from "@tanstack/react-query";
import { processResponse } from "./process";

export async function getWishlist({ queryKey }: { queryKey: QueryKey }) {
  const [_key, listName] = queryKey;
  const res = await fetch(`/api/list?listName=${listName || "wishlist"}`);
  return processResponse(res);
}
