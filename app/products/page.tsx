import { Flex } from "@radix-ui/themes";
import FilterSidebar from "./FilterSidebar";
import ProductCardContainer from "./ProductCardContainer";
import Toolbar from "./Toolbar";

const ProductsPage = async () => {
  return (
    <Flex width="100%" justify="between" gap="5">
      <FilterSidebar />

      <Flex width="100%" direction="column" gap="5" justify="start" align="start" px="2rem">
        {/* <Button href="/products/new" as={Link} color="primary" variant="solid">
          New Product
        </Button> */}
        <Toolbar />

        <ProductCardContainer />
      </Flex>
    </Flex>
  );
};

export default ProductsPage;
