import prisma from "@/prisma/client";
import React from "react";
import ProductCardContainer from "./ProductCardContainer";
import { Button, Link } from "@nextui-org/react";
import { Flex } from "@radix-ui/themes";

const ProductsPage = async () => {
  const products = await prisma.product.findMany();
  return (
    <Flex direction="column" gap="5" justify='start' align='start'>
      <Button href="/products/new" as={Link} color="primary" variant="solid">
        New Product
      </Button>
      <ProductCardContainer list={products} />
    </Flex>
  );
};

export default ProductsPage;
