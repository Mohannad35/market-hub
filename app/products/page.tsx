import prisma from "@/prisma/client";
import React from "react";
import ProductCardContainer from "./ProductCardContainer";
import { Button, Link } from "@nextui-org/react";
import { Flex } from "@radix-ui/themes";
import FilterSidebar from "./FilterSidebar";

const ProductsPage = async () => {
  return (
    <Flex justify="between" gap="5">
      <FilterSidebar />

      <Flex direction="column" gap="5" justify="start" align="start" px="2rem">
        <Button href="/products/new" as={Link} color="primary" variant="solid">
          New Product
        </Button>
        <ProductCardContainer />
      </Flex>
    </Flex>
  );
};

export default ProductsPage;
