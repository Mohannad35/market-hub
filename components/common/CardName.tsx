"use client";

import { Link, Tooltip } from "@nextui-org/react";
import { Text } from "@radix-ui/themes";
import NextLink from "next/link";

const CardName = ({ href, name }: { href: string; name: string }) => {
  return (
    <Link href={href} as={NextLink} color="foreground">
      <Tooltip content={name} radius="sm" delay={1000}>
        <Text size="5" weight="medium" className="line-clamp-2 text-start">
          {name}
        </Text>
      </Tooltip>
    </Link>
  );
};

export default CardName;
