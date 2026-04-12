import { getProduct } from "@/lib/query-functions/product";
import EditProductForm from "./EditProductForm";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";

const EditProductPage = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = await params;
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["editProduct", slug, "brand,category"],
    queryFn: getProduct,
  });

  return (
    <div className="container">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <EditProductForm slug={slug} />
      </HydrationBoundary>
    </div>
  );
};

export default EditProductPage;
