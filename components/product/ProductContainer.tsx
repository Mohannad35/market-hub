"use client";

import LoadingIndicator from "@/components/common/LoadingIndicator";
import { useQueryHook } from "@/hook/use-tanstack-hooks";
import { Product } from "@prisma/client";
import { Flex, Text } from "@radix-ui/themes";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo } from "react";
import AppliedFilters from "./AppliedFilters";
import ProductCardContainer from "./ProductCardContainer";
import ProductFilter from "./ProductFilter";

const ProductContainer = ({ api, uniqueKey }: { api: string; uniqueKey: string[] }) => {
  const searchParams = useSearchParams();
  const query = useMemo(() => {
    const search = searchParams.get("search") || searchParams.get("q");
    const q = new URLSearchParams(searchParams.toString());
    search && q.set("search", search);
    q.delete("q");
    return q;
  }, [searchParams]);

  const { data, isSuccess, error, isLoading, isRefetching, refetch } = useQueryHook<{
    items: Product[];
    count: number;
  }>({ url: api, key: uniqueKey, query: query.toString() });

  useEffect(() => {
    refetch();
  }, [refetch, searchParams]);

  if (isLoading || isRefetching) return <LoadingIndicator />;
  else if (error) return <Text>Error: {error.message}</Text>;
  else if (!isSuccess || !data) return <Text>No Products found</Text>;

  return (
    <Flex direction="column" width="100%" gap="5">
      <ProductFilter count={data.count} />
      {searchParams.size > 0 && <AppliedFilters />}

      <Flex width="100%" direction="column" justify="start" align="start">
        <ProductCardContainer
          label="products"
          items={data.items}
          count={data.count}
          showDelete={true}
          showEdit={true}
          showFav={true}
          className={"h-[16rem] w-[16rem]"}
          // width={"14rem"}
        />
      </Flex>
    </Flex>
  );
};

export default ProductContainer;
