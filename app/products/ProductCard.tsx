"use client";

import { Card, CardBody, CardFooter, CardProps, Image } from "@nextui-org/react";
import { Product } from "@prisma/client";
import { useRouter } from "next/navigation";

export interface ProductCardProps extends CardProps {
  product: Product;
}

const ProductCard = ({ onPress, product, ...props }: ProductCardProps) => {
  const router = useRouter();

  const handlePress = (slug: string) => {
    router.push(`/products/${slug}`);
  };
  return (
    <Card shadow="sm" isPressable onPress={() => handlePress(product.slug)} {...props}>
      <CardBody className="overflow-visible p-0">
        <Image
          shadow="sm"
          radius="lg"
          width="100%"
          alt={product.name}
          className="h-[140px] w-full object-cover"
          src={product.image[0]}
        />
      </CardBody>
      <CardFooter className="justify-between text-small">
        <b>{product.name}</b>
        <p className="text-default-500">{product.price}</p>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
