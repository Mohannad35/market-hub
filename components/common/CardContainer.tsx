"use client";

import Pagination from "@/components/common/Pagination";
import { Modify } from "@/lib/types";
import { Flex, FlexProps, Grid, Text } from "@radix-ui/themes";

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
      <Grid columns={{ initial: "2", sm: "3", md: "4", lg: "5" }} gapX="6" gapY="8" width="dauto">
        {items && items.map((item, index) => <Card key={index} item={item} />)}
      </Grid>
      {count && <Pagination count={count} />}
    </Flex>
  );
};

export default CardContainer;
