import CardContainer from "@/components/common/CardContainer";
import { Flex } from "@radix-ui/themes";
import FilterSidebar from "./FilterSidebar";
import ProductCard from "@/components/product/ProductCard";

const ProductsPage = async () => {
  return (
    <Flex width="100%" justify="between" gap="5">
      <FilterSidebar />

      <Flex width="100%" direction="column" gap="5" justify="start" align="start" px="2rem">
        <CardContainer
          label="products"
          api="/api/products"
          uniqueKey="searchProducts"
          Card={ProductCard}
        />
      </Flex>
    </Flex>
  );
};

export default ProductsPage;
