"use client";

import { useQueryHook } from "@/hook/use-tanstack-hooks";
import { CartWithItems } from "@/lib/types";
import { Icon as Iconify } from "@iconify/react";
import { Badge, Button, Skeleton } from "@nextui-org/react";
import Link from "next/link";

const NavCart = () => {
  const { data, isLoading, error } = useQueryHook<CartWithItems>({
    url: "/api/cart",
    key: ["getCart"],
  });

  if (isLoading) return <Skeleton className="h-[2.5rem] w-[2.5rem] rounded-medium" />;
  else if (error) return <></>;
  return (
    <Button as={Link} href="/cart" isIconOnly variant="light" size="lg" radius="sm">
      <Badge content={data?.cartItems.length || 0} color="primary" size="md">
        <Iconify icon="solar:cart-large-2-bold-duotone" fontSize={32} />
        <span className="sr-only">Cart</span>
      </Badge>
    </Button>
  );
};

export default NavCart;
