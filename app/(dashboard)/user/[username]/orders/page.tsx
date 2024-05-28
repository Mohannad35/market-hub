import { getUserOrders } from "@/lib/query-functions/order";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import Orders from "./Orders";

const OrdersPage = async () => {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({ queryKey: ["getUserOrders"], queryFn: getUserOrders });

  return (
    <div className="container">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Orders />
      </HydrationBoundary>
    </div>
  );
};

export default OrdersPage;
