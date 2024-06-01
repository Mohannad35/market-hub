import { getWishlist } from "@/lib/query-functions/wishlist";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import WishlistDetails from "./WishlistDetails";

const WishlistPage = async () => {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({ queryKey: ["getWishlist"], queryFn: getWishlist });

  return (
    <div className="container">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <WishlistDetails />
      </HydrationBoundary>
    </div>
  );
};

export default WishlistPage;
