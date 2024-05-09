"use client";

import Pagination from "@/components/common/Pagination";
import { useQueryHook } from "@/hook/use-tanstack-hooks";
import { Modify } from "@/lib/types";
import { Spinner } from "@nextui-org/spinner";
import { Flex, FlexProps, Text } from "@radix-ui/themes";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

type Props = Modify<
  FlexProps,
  { api: string; uniqueKey: string; Card: JSX.ElementType; label: string }
>;
const CardContainer = ({ api, uniqueKey, Card, label, ...props }: Props) => {
  const searchParams = useSearchParams();
  const search = searchParams.get("search") || searchParams.get("q");
  const query = new URLSearchParams(searchParams.toString());
  search && query.set("search", search);
  query.delete("q");

  const { data, isSuccess, error, isLoading, isRefetching, refetch } = useQueryHook<{
    items: {}[];
    count: number;
  }>(api, [uniqueKey], query.toString());

  useEffect(() => {
    refetch();
  }, [refetch, searchParams]);

  if (isLoading || isRefetching)
    return (
      <Flex width="100%" height="100%" justify="center" align="center">
        <Spinner />
      </Flex>
    );
  else if (error) return <Text>Error: {error.message}</Text>;
  else if (!isSuccess || !data) return <Text>No {label} found</Text>;
  const { items, count } = data;
  if (count === 0)
    return (
      <Flex width="100%" direction="column" align="center" gapY="5">
        <Text size="5">No {label} found</Text>
      </Flex>
    );
  return (
    <Flex width="100%" direction="column" align="center" gapY="5">
      <Flex
        width="100%"
        direction="row"
        wrap="wrap"
        gap="3"
        justify="start"
        align="start"
        {...props}
      >
        {items && items.map((item, index) => <Card key={index} item={item} />)}
      </Flex>
      <Pagination count={count} />
    </Flex>
  );
};

export default CardContainer;
