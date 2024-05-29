import React from "react";
import OrderDetails from "./OrderDetails";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { getOrder } from "@/lib/query-functions/order";

const OrderPage = async ({ params: { code } }: { params: { code: string } }) => {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({ queryKey: ["getOrder", code], queryFn: getOrder });

  return (
    <div className="container">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <OrderDetails code={code} />
      </HydrationBoundary>
    </div>
  );
};

export default OrderPage;
