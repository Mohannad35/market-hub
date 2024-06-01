"use client";

import Pagination from "@/components/common/Pagination";
import { Modify } from "@/lib/types";
import { Flex, FlexProps, Text } from "@radix-ui/themes";

type Props = Modify<
  FlexProps,
  { items: any[]; count: number; Card: JSX.ElementType; label: string }
>;
const CardContainer = ({ items, count, label, Card, ...props }: Props) => {
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
        gap="6"
        justify="start"
        align="start"
        {...props}
      >
        {items && items.map((item, index) => <Card key={index} item={item} />)}
      </Flex>
      {count && <Pagination count={count} />}
    </Flex>
  );
};

export default CardContainer;
