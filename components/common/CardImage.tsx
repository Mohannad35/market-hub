"use client";

import { Button } from "@nextui-org/button";
import { Card, CardFooter } from "@nextui-org/card";
import { Image } from "@nextui-org/image";
import { Flex } from "@radix-ui/themes";
import { EditIcon, Trash2Icon } from "lucide-react";
import { useSession } from "next-auth/react";
import NextImage from "next/image";
import NextLink from "next/link";

interface Props {
  src: string | null;
  href: string;
  name: string;
  handleDelete: () => void;
}
const CardImage = ({ src, href, name, handleDelete }: Props) => {
  const { data, status } = useSession();

  return (
    <Card radius="none" shadow="none" className="h-[16rem] w-[16rem] border-none bg-transparent">
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
          fallbackSrc={process.env.IMAGE_PLACEHOLDER}
        />
      </Flex>
      {status === "authenticated" && (
        <CardFooter className="absolute bottom-1 z-10 h-[40px] w-full justify-between rounded-large py-0">
          <Button
            isIconOnly
            variant="faded"
            size="sm"
            radius="lg"
            className="z-50"
            as={NextLink}
            href={href}
          >
            <EditIcon size={20} />
          </Button>
          <Button
            isIconOnly
            variant="faded"
            color="danger"
            size="sm"
            className="z-50"
            radius="lg"
            onPress={() => handleDelete()}
          >
            <Trash2Icon size={20} />
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default CardImage;
