"use client";

import { Link, Tooltip } from "@nextui-org/react";
import { Text, type TextProps } from "@radix-ui/themes";
import NextLink from "next/link";

type CardNameProps = TextProps & {
  href: string;
  name: string;
};

const CardName = ({ href, name, ...props }: CardNameProps) => {
  return (
    <Link href={href} as={NextLink} color="foreground">
      <Tooltip content={name} radius="sm" delay={1000}>
        <Text size="4" weight="medium" className="line-clamp-2 text-start" {...props}>
          {name}
        </Text>
      </Tooltip>
    </Link>
  );
};

export default CardName;
