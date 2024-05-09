import { QueryKey } from "@tanstack/react-query";
import { processResponse } from "./process";

export async function getBrand({ queryKey }: { queryKey: QueryKey }) {
  const [_key, slug] = queryKey;
  const res = await fetch(`/api/brands/${slug}`);
  return processResponse(res);
}
