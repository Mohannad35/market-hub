import { getCoupon } from "@/lib/query-functions/coupon";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import EditCouponForm from "./EditCouponForm";

const EditCouponPage = async ({ params }: { params: Promise<{ code: string }> }) => {
  const { code } = await params;
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({ queryKey: ["getCouponEdit", code], queryFn: getCoupon });

  return (
    <div className="container">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <EditCouponForm code={code} />
      </HydrationBoundary>
    </div>
  );
};

export default EditCouponPage;
