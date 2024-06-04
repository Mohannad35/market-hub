"use client";

import { useQueryHook } from "@/hook/use-tanstack-hooks";
import { Modify } from "@/lib/types";
import { Flex, FlexProps, Text } from "@radix-ui/themes";
import LoadingIndicator from "./LoadingIndicator";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";

type Props = {
  api: string;
  uniqueKey: string[];
  Card: JSX.ElementType;
  label: string;
  width?: string;
  height?: string;
  imageHeight?: string;
};
const CardScrollContainer = ({ api, uniqueKey, label, Card, ...props }: Props) => {
  const { data, isSuccess, error, isLoading, isRefetching } = useQueryHook<{
    items: {}[];
    count: number;
  }>({ url: api, key: uniqueKey });

  if (isLoading || isRefetching) return <LoadingIndicator />;
  else if (error) return <Text>Error: {error.message}</Text>;
  else if (!isSuccess || !data || data.items.length < 1)
    return (
      <Flex width="100%" direction="column" align="center">
        <Text size="5">No {label} found</Text>
      </Flex>
    );
  const { items, count } = data;
  return (
    <Flex width="100%" direction="column" align="start" gap="2">
      <ScrollArea className="w-full whitespace-nowrap">
        <Flex width="100%" justify="start" gap="6" p="5">
          {items.map((item, index) => (
            <Card
              key={index}
              item={item}
              width={props.width || "12rem"}
              height={props.height || "12rem"}
              imageHeight={props.imageHeight || "11rem"}
            />
          ))}
        </Flex>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </Flex>
  );
};

export default CardScrollContainer;
