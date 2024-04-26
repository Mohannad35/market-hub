"use client";

import { Button, Card, CardBody, CardFooter, CardProps, Image } from "@nextui-org/react";
import { Product } from "@prisma/client";
import { useRouter } from "next/navigation";
import NextImage from "next/image";
import { Flex, Text } from "@radix-ui/themes";

export interface ProductCardProps extends CardProps {
  product: Product;
}

const ProductCard = ({ onPress, product, ...props }: ProductCardProps) => {
  const router = useRouter();

  const handlePress = (slug: string) => {
    router.push(`/products/${slug}`);
  };
  return (
    <Card
      shadow="sm"
      className="max-h-[20rem] w-[12rem]"
      isPressable
      onPress={() => handlePress(product.slug)}
      {...props}
    >
      <CardBody className="overflow-visible p-0">
        <Image
          shadow="none"
          radius="none"
          width={300}
          height={300}
          as={NextImage}
          alt={product.name || "Product Image"}
          src={product.image[0] || process.env.IMAGE_PLACEHOLDER}
        />
      </CardBody>
      <CardFooter className="justify-between p-2 text-small">
        <Flex width="100%" gap="2" direction="column" justify="start" align="start">
          <Text size="5" weight="medium" wrap="nowrap">
            {product.name}
          </Text>
          <Flex width="100%" direction="row" justify="between" align="center">
            <Text weight="medium" className="text-muted-foreground">
              {product.price} $
            </Text>
            <Button color="primary" variant="solid" size="sm" radius="lg">
              Add to Cart
            </Button>
          </Flex>
        </Flex>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
