"use client";

import { Icon as Iconify } from "@iconify/react/dist/iconify.js";
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
import { useMemo } from "react";

interface Props {
  src?: string | null;
  href: string;
  edit?: string;
  name: string;
  width?: string;
  height?: string;
  className?: string;
  showEdit?: boolean;
  showDelete?: boolean;
  showFav?: boolean;
  isFav?: boolean;
  handleDelete?: () => void;
  handleFav?: () => void;
}
const CardImage = ({
  src,
  href,
  edit,
  name,
  handleDelete,
  width,
  height,
  className,
  showDelete,
  showEdit,
  showFav,
  isFav,
  handleFav,
}: Props) => {
  return (
    <Card radius="none" shadow="none" className={cn("border-none bg-transparent")}>
      <CardBody
        as={NextLink}
        href={href}
        className="items-center justify-center overflow-x-clip overflow-y-visible p-0"
      >
        <Image
          isZoomed
          radius="none"
          width={720}
          height={720}
          className={cn("object-contain", className || "h-[12rem] w-[12rem]")}
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
      </CardBody>

      {showFav && (
        <Button
          isIconOnly
          variant="faded"
          size="sm"
          radius="full"
          className="absolute right-1 top-1 z-40"
          onPress={() => handleFav && handleFav()}
        >
          <Iconify icon="solar:star-bold" color={isFav ? "#f5a524" : ""} fontSize={20} />
        </Button>
      )}

      {showEdit && (
        <Button
          isIconOnly
          variant="faded"
          size="sm"
          radius="lg"
          className="absolute bottom-1 left-1 z-40"
          as={NextLink}
          href={edit}
        >
          <EditIcon size={20} />
        </Button>
      )}

      {showDelete && (
        <Button
          isIconOnly
          variant="faded"
          color="danger"
          size="sm"
          className="absolute bottom-1 right-1 z-40"
          radius="lg"
          onPress={() => handleDelete && handleDelete()}
        >
          <Trash2Icon size={20} />
        </Button>
      )}
    </Card>
  );
};

export default CardImage;
