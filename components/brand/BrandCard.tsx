"use client";

import { Button } from "@nextui-org/button";
import { Card, CardBody, CardFooter, CardProps } from "@nextui-org/card";
import { Image } from "@nextui-org/image";
import { Link } from "@nextui-org/react";
import { Tooltip } from "@nextui-org/tooltip";
import { Brand } from "@prisma/client";
import { Flex, Text } from "@radix-ui/themes";
import { EditIcon, Trash2Icon } from "lucide-react";
import { useSession } from "next-auth/react";
import NextImage from "next/image";
import NextLink from "next/link";
import CardImage from "../common/CardImage";
import CardName from "../common/CardName";

interface Props extends CardProps {
  item: Brand;
}
const BrandCard = ({ item, ...props }: Props) => {
  const { data, status } = useSession();
  const { slug, name, image } = item;

  if (status === "loading") return <></>;
  return (
    <Card radius="none" shadow="none" className="max-h-[30rem] w-[16rem] bg-transparent" {...props}>
      <CardBody
        as={NextLink}
        className="items-center justify-center overflow-x-clip overflow-y-visible p-0"
        href={`/products?brands=${item.slug}`}
      >
        <CardImage
          src={image}
          href={`/dashboard/brands/edit/${slug}`}
          name={name}
          handleDelete={() => console.log("Delete")}
        />
      </CardBody>
      <CardFooter className="flex-col p-2 text-small">
        <CardName href={`/products?brands=${item.slug}`} name={name} />
      </CardFooter>
    </Card>
  );
};

export default BrandCard;
