import { getCoupon } from "@/lib/query-functions/coupon";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import React from "react";
import CouponDetails from "./CouponDetails";

const CouponDetailsPage = async ({ params: { code } }: { params: { code: string } }) => {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({ queryKey: ["getCoupon", code], queryFn: getCoupon });

  return (
    <div className="container">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <CouponDetails code={code} />
      </HydrationBoundary>
    </div>
  );
};

export default CouponDetailsPage;
