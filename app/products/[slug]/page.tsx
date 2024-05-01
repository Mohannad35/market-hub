import { Flex } from "@radix-ui/themes";
import ProductDetails from "./ProductDetails";

const ProductDetailsPage = ({ params: { slug } }: { params: { slug: string } }) => {
  return (
    <Flex direction="column" className="container">
      <ProductDetails slug={slug} />
    </Flex>
  );
};

export default ProductDetailsPage;
