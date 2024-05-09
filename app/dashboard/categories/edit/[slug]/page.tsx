import { getCategory } from "@/lib/query-functions/category";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import EditCategoryForm from "./EditCategoryForm";

const EditProductPage = async ({ params: { slug } }: { params: { slug: string } }) => {
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
