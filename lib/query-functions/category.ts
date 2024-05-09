import { QueryKey } from "@tanstack/react-query";
import { processResponse } from "./process";

export async function getCategory({ queryKey }: { queryKey: QueryKey }) {
  const [_key, slug] = queryKey;
  const res = await fetch(`/api/categories/${slug}`);
  return processResponse(res);
}
