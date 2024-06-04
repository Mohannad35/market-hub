"use client";

import LoadingIndicator from "@/components/common/LoadingIndicator";
import { useQueryHook } from "@/hook/use-tanstack-hooks";
import { Product } from "@prisma/client";
import { Grid, Text } from "@radix-ui/themes";
import ProductCard from "./ProductCard";

const ProductRowContainer = ({ api, uniqueKey }: { api: string; uniqueKey: string[] }) => {
  const { data, isSuccess, error, isLoading, isRefetching, refetch } = useQueryHook<{
    items: Product[];
    count: number;
  }>({ url: api, key: uniqueKey });

  if (isLoading || isRefetching) return <LoadingIndicator />;
  else if (error) return <Text>Error: {error.message}</Text>;
  else if (!isSuccess || !data || data.items.length < 1) return <Text>No Products found</Text>;

  return (
    <Grid
      columns={{ initial: "2", sm: "3", md: "4", lg: "5", xl: "5" }}
      gapX="6"
      gapY="8"
      width="auto"
    >
      {data.items.map((item, index) => (
        <ProductCard key={index} item={item} showDelete={false} showEdit={false} showFav={false} />
      ))}
    </Grid>
  );
};

export default ProductRowContainer;
