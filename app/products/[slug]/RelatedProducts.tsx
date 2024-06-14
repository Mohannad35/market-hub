"use client";

import ProductCard from "@/components/product/ProductCard";
import { getProduct, getRelatedProducts } from "@/lib/query-functions/product";
import { ProductWithBrandAndCategoryAndRates } from "@/lib/types";
import { Divider, ScrollShadow } from "@nextui-org/react";
import { Product } from "@prisma/client";
import { Flex, Text } from "@radix-ui/themes";
import { useQuery } from "@tanstack/react-query";

const RelatedProducts = ({ slug }: { slug: string }) => {
  const { data: product } = useQuery<ProductWithBrandAndCategoryAndRates>({
    queryKey: ["product", slug],
    queryFn: getProduct,
  });

  // Get related products with the same category parent when the product is loaded
  const productCategoryParent = product?.category.parent;
  const { data, error, isLoading, isRefetching } = useQuery<{ items: Product[]; count: number }>({
    queryKey: ["relatedProducts", productCategoryParent],
    queryFn: getRelatedProducts,
    staleTime: 1000 * 60, // 1 minute
    retry: 3,
    enabled: !!productCategoryParent,
  });

  if (isLoading || isRefetching) return <></>;
  else if (error) return <Text>Error: {error.message}</Text>;
  else if (!data) return <></>;
  const products = data.items.filter(item => item.slug !== slug);
  if (products.length < 1) return <></>;
  return (
    <>
      <Divider />
      <Text size="4" weight="medium">
        Related Products
      </Text>
      <ScrollShadow orientation="horizontal" hideScrollBar className="container flex gap-6 p-0">
        {products.map((product, index) => (
          <ProductCard
            key={index}
            item={product}
            showDelete={false}
            showEdit={false}
            showFav
            width="16rem"
            className="h-[16rem] w-[16rem]"
          />
        ))}
      </ScrollShadow>
    </>
  );
};

export default RelatedProducts;
