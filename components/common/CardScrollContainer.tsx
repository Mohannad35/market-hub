"use client";

import { useQueryHook } from "@/hook/use-tanstack-hooks";
import { ScrollShadow } from "@nextui-org/react";
import { Flex, Text } from "@radix-ui/themes";
import LoadingIndicator from "./LoadingIndicator";

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
      <ScrollShadow orientation="horizontal" hideScrollBar className="container p-0">
        <Flex width="100%" justify="start" gap="6">
          {items.map((item, index) => (
            <Card
              key={index}
              item={item}
              width={props.width || "11rem"}
              height={props.height || "12rem"}
              imageHeight={props.imageHeight || "11rem"}
            />
          ))}
        </Flex>
      </ScrollShadow>
    </Flex>
  );
};

export default CardScrollContainer;
