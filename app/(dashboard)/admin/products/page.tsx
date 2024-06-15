import ProductContainer from "@/components/product/ProductContainer";
import Search from "@/components/product/Search";
import { Flex } from "@radix-ui/themes";

const DashboardProductsPage = () => {
  return (
    <Flex direction="column" width="100%" gapY="4" pr="4" pl={{ initial: "4", sm: "0" }}>
      <Search queryName="q" />

      <Flex width="100%" direction="column" gap="5" justify="start">
        <ProductContainer
          api="/api/products"
          uniqueKey={["dashboardProducts"]}
          className="h-[16rem]"
          columns={{ initial: "2", sm: "2", md: "3", lg: "4" }}
        />
      </Flex>
    </Flex>
  );
};

export default DashboardProductsPage;
