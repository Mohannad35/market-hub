"use client";

import Rating from "@/components/common/Rating";
import { Button } from "@nextui-org/button";
import { Card, CardBody, CardFooter, CardProps } from "@nextui-org/card";
import { Image } from "@nextui-org/image";
import { Link } from "@nextui-org/link";
import { Tooltip } from "@nextui-org/tooltip";
import { Product } from "@prisma/client";
import { Flex, Text } from "@radix-ui/themes";
import NextImage from "next/image";
import NextLink from "next/link";
import CardImage from "../common/CardImage";
import CardName from "../common/CardName";

interface Props extends CardProps {
  item: Product;
}
const ProductCard = ({ item, ...props }: Props) => {
  const { name, image, price, slug, rating, ratingCount } = item;
  const handleDelete = () => {
    console.log("Delete", item.slug);
  };

  return (
    <Card radius="none" shadow="none" className="max-h-[30rem] w-[16rem] bg-card" {...props}>
      <CardBody className="p-0">
        <CardImage
          src={image[0].secure_url}
          href={`/products/${slug}`}
          edit={`/dashboard/products/edit/${slug}`}
          name={name}
          handleDelete={handleDelete}
        />
      </CardBody>
      <CardFooter className="justify-between p-2 text-small">
        <Flex width="260px" gap="2" direction="column" justify="start" align="start">
          <CardName href={`/products/${slug}`} name={name} />

          <Rating rating={rating} ratingCount={ratingCount} />

          <Flex width="100%" direction="row" justify="between" align="center">
            <Text weight="medium" className="text-muted-foreground">
              {price} EGP
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
