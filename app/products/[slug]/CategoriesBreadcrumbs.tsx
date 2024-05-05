"use client";

import { capitalize } from "@/lib/utils";
import {
  BreadcrumbItem,
  Breadcrumbs,
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/react";
import { Flex } from "@radix-ui/themes";

const CategoriesBreadcrumbs = ({ path }: { path: string }) => {
  return (
    <Breadcrumbs
      size="sm"
      underline="hover"
      maxItems={3}
      itemsBeforeCollapse={1}
      itemsAfterCollapse={2}
      renderEllipsis={({ items, ellipsisIcon, separator }) => (
        <Flex align="center">
          <Dropdown>
            <DropdownTrigger>
              <Button isIconOnly className="h-6 w-6 min-w-6" size="sm" variant="light">
                {ellipsisIcon}
              </Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="Routes">
              {items.map((item, index) => (
                <DropdownItem key={index} href={item.href}>
                  {item.children}
                </DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>
          {separator}
        </Flex>
      )}
    >
      {path.split("/").map(item => {
        const query = new URLSearchParams({
          category: path.slice(0, path.lastIndexOf(item) + item.length),
        }).toString();
        if (item.length > 0)
          return (
            <BreadcrumbItem key={item} href={`/products?${query}`} isCurrent={false}>
              {capitalize(item)}
            </BreadcrumbItem>
          );
      })}
    </Breadcrumbs>
  );
};

export default CategoriesBreadcrumbs;
