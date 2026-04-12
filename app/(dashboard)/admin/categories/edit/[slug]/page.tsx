import { getCategory } from "@/lib/query-functions/category";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import EditCategoryForm from "./EditCategoryForm";

const EditProductPage = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = await params;
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({ queryKey: ["getCategoryEdit", slug], queryFn: getCategory });

  return (
    <div className="container">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <EditCategoryForm slug={slug} />
      </HydrationBoundary>
    </div>
  );
};

export default EditProductPage;
