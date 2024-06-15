import ProductContainer from "@/components/product/ProductContainer";
import { Flex } from "@radix-ui/themes";

const ProductsPage = async () => {
  return (
    <Flex direction="column" width="100%">
      <ProductContainer api="/api/products" uniqueKey={["searchProducts"]} className="h-[16rem]" />
    </Flex>
  );
};

export default ProductsPage;
