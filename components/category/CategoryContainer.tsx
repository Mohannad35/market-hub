"use client";

import CategoryCard from "@/components/category/CategoryCard";
import CardContainer from "@/components/common/CardContainer";
import LoadingIndicator from "@/components/common/LoadingIndicator";
import { useQueryHook } from "@/hook/use-tanstack-hooks";
import { Category } from "@prisma/client";
import { Flex, Text } from "@radix-ui/themes";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo } from "react";

const CategoryContainer = ({ api, uniqueKey }: { api: string; uniqueKey: string[] }) => {
  const searchParams = useSearchParams();
  const query = useMemo(() => {
    const search = searchParams.get("search") || searchParams.get("q");
    const q = new URLSearchParams(searchParams.toString());
    search && q.set("search", search);
    q.delete("q");
    return q;
  }, [searchParams]);

  const { data, isSuccess, error, isLoading, isRefetching, refetch } = useQueryHook<{
    items: Category[];
    count: number;
  }>({ url: api, key: uniqueKey, query: query.toString() });

  useEffect(() => {
    refetch();
  }, [refetch, searchParams]);

  if (isLoading || isRefetching) return <LoadingIndicator />;
  else if (error) return <Text>Error: {error.message}</Text>;
  else if (!isSuccess || !data) return <Text>No Categories found</Text>;

  return (
    <Flex width="100%" direction="column" justify="start" align="start">
      <CardContainer label="categories" items={data.items} count={data.count} Card={CategoryCard} />
    </Flex>
  );
};

export default CategoryContainer;
