"use client";

import { Button } from "@nextui-org/button";
import { Card, CardBody, CardFooter } from "@nextui-org/card";
import { Image } from "@nextui-org/image";
import { cn } from "@nextui-org/react";
import { Flex } from "@radix-ui/themes";
import { EditIcon, Trash2Icon } from "lucide-react";
import { useSession } from "next-auth/react";
import { getCldImageUrl } from "next-cloudinary";
import NextImage from "next/image";
import NextLink from "next/link";

interface Props {
  src?: string | null;
  href: string;
  edit: string;
  name: string;
  width?: string;
  height?: string;
  handleDelete: () => void;
}
const CardImage = ({ src, href, edit, name, handleDelete, width, height }: Props) => {
  const { data, status } = useSession();
  const className = `h-[${height || "16rem"}] w-[${width || "16rem"}]`;

  return (
    <Card radius="none" shadow="none" className={cn("border-none bg-transparent", className)}>
      <CardBody
        as={NextLink}
        href={href}
        className="items-center justify-center overflow-x-clip overflow-y-visible p-0"
      >
        <Flex width={width || "16rem"} height={height || "16rem"} justify="center" align="center">
          <Image
            isZoomed
            removeWrapper
            radius="none"
            width={480}
            height={480}
            className={cn("object-contain", className)}
            as={NextImage}
            alt={name}
            src={src || undefined}
            fallbackSrc={getCldImageUrl({
              src: "my-next-app/No-Image-Placeholder_fabmtj",
              width: 265,
              height: 300,
              crop: "auto",
            })}
          />
        </Flex>
      </CardBody>
      {status === "authenticated" && data.user.role === "admin" && (
        <>
          <Button
            isIconOnly
            variant="faded"
            size="sm"
            radius="lg"
            className="absolute bottom-1 left-1 z-50"
            as={NextLink}
            href={edit}
          >
            <EditIcon size={20} />
          </Button>
          <Button
            isIconOnly
            variant="faded"
            color="danger"
            size="sm"
            className="absolute bottom-1 right-1 z-50"
            radius="lg"
            onPress={() => handleDelete()}
          >
            <Trash2Icon size={20} />
          </Button>
        </>
      )}
    </Card>
  );
};

export default CardImage;
