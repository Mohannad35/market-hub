import { QueryKey } from "@tanstack/react-query";
import { processResponse } from "./process";

export async function getCoupon({ queryKey }: { queryKey: QueryKey }) {
  const [_key, code] = queryKey;
  const res = await fetch(`/api/coupon/${code}`);
  return processResponse(res);
}
