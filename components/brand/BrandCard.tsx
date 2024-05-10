"use client";

import { Card, CardBody, CardFooter, CardProps } from "@nextui-org/card";
import { Brand } from "@prisma/client";
import { useSession } from "next-auth/react";
import CardImage from "../common/CardImage";
import CardName from "../common/CardName";

interface Props extends CardProps {
  item: Brand;
}
const BrandCard = ({ item, ...props }: Props) => {
  const { slug, name, image } = item;
  const handleDelete = () => {
    console.log("Delete", item.slug);
  };

  return (
    <Card radius="none" shadow="none" className="max-h-[30rem] w-[16rem] bg-transparent" {...props}>
      <CardBody className="p-0">
        <CardImage
          src={image?.secure_url}
          href={`/products?brands=${item.slug}`}
          edit={`/dashboard/brands/edit/${slug}`}
          name={name}
          handleDelete={handleDelete}
        />
      </CardBody>
      <CardFooter className="flex-col p-2 text-small">
        <CardName href={`/products?brands=${item.slug}`} name={name} />
      </CardFooter>
    </Card>
  );
};

export default BrandCard;
