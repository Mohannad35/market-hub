import { getBrand } from "@/lib/query-functions/brand";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import EditProductForm from "./EditBrandForm";

const EditProductPage = async ({ params: { slug } }: { params: { slug: string } }) => {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({ queryKey: ["getBrandEdit", slug], queryFn: getBrand });

  return (
    <div className="container">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <EditProductForm slug={slug} />
      </HydrationBoundary>
    </div>
  );
};

export default EditProductPage;
