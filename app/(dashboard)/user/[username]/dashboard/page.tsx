import { Flex } from "@radix-ui/themes";
import ProductsChart from "./ProductsChart";

export default function ProductDetailsPage() {
  return (
    <Flex direction="column" width="100%" gap="2" align="start" justify="start">
      <ProductsChart />
    </Flex>
  );
}
