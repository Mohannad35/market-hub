import { Flex } from "@radix-ui/themes";
import ProductDetails from "./ProductDetails";
import ProductRates from "./ProductRates";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { Divider } from "@nextui-org/divider";
import RelatedProducts from "./RelatedProducts";
import ProductsYouMayLike from "./ProductsYouMayLike";
import { getProduct } from "@/lib/query-functions/product";

interface Params {
  params: { slug: string };
}

export default async function ProductDetailsPage({ params: { slug } }: Params) {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({ queryKey: ["product", slug], queryFn: getProduct });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Flex direction="column" className="container" gapY="4">
        <ProductDetails slug={slug} />
        {/* Related products based on category */}
        <RelatedProducts slug={slug} />
        <ProductRates slug={slug} />
        {/* Products you may like based on brand */}
        <ProductsYouMayLike slug={slug} />
      </Flex>
    </HydrationBoundary>
  );
}
