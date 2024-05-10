"use client";

import { Button } from "@nextui-org/button";
import { Card, CardBody, CardFooter } from "@nextui-org/card";
import { Image } from "@nextui-org/image";
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
  handleDelete: () => void;
}
const CardImage = ({ src, href, edit, name, handleDelete }: Props) => {
  const { data, status } = useSession();

  return (
    <Card radius="none" shadow="none" className="h-[16rem] w-[16rem] border-none bg-transparent">
      <CardBody
        as={NextLink}
        href={href}
        className="items-center justify-center overflow-x-clip overflow-y-visible p-0"
      >
        <Flex width="16rem" height="16rem" justify="center" align="center">
          <Image
            shadow="none"
            radius="none"
            width={480}
            height={480}
            className="h-[16rem] w-[16rem] object-contain"
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
      {status === "authenticated" && (
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
