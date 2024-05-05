"use client";

import ProductCard from "@/components/product/ProductCard";
import { ProductWithBrandAndCategoryAndRates } from "@/lib/types";
import { Divider } from "@nextui-org/react";
import { Product } from "@prisma/client";
import { Flex, Text } from "@radix-ui/themes";
import { useQuery } from "@tanstack/react-query";
import { getProduct, getRelatedProducts } from "./getProduct";

const RelatedProducts = ({ slug }: { slug: string }) => {
  const { data: product } = useQuery<ProductWithBrandAndCategoryAndRates>({
    queryKey: ["product", slug],
    queryFn: getProduct,
  });

  // Get related products with the same category parent when the product is loaded
  const productCategoryParent = product?.category.parent;
  const { data, error, isLoading, isRefetching } = useQuery<{ products: Product[]; count: number }>(
    {
      queryKey: ["relatedProducts", productCategoryParent],
      queryFn: getRelatedProducts,
      staleTime: 1000 * 60, // 1 minute
      retry: 3,
      enabled: !!productCategoryParent,
    }
  );

  if (isLoading || isRefetching) return <></>;
  else if (error) return <Text>Error: {error.message}</Text>;
  else if (!data) return <></>;
  const products = data.products.filter(p => p.slug !== slug);
  if (products.length < 1) return <></>;
  return (
    <>
      <Divider />
      <Flex width="100%" direction="row" gap="3" justify="start" align="start">
        {products.map((product, index) => (
          <ProductCard key={index} product={product} />
        ))}
      </Flex>
    </>
  );
};

export default RelatedProducts;
