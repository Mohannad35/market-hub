"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Accordion, AccordionItem, cn, Divider, Listbox, ListboxItem } from "@nextui-org/react";
import { Flex, Text } from "@radix-ui/themes";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";
import { accordionItems, listItems } from "./data";

const DashboardLayout = ({ children }: Readonly<{ children: ReactNode }>) => {
  const pathname = usePathname();

  return (
    <Flex width="100%">
      <ScrollArea className="h-[calc(100vh-81px)] w-[20rem] rounded-none border-r p-3">
        <Listbox variant="flat" selectionMode="single" hideSelectedIcon aria-label="Dashboard">
          {listItems.map((item, i) => (
            <ListboxItem
              key={item.href}
              as={Link}
              href={item.href}
              startContent={<item.Icon />}
              className={cn({
                "bg-default/40 text-default-foreground transition-colors": pathname === item.href,
              })}
            >
              {item.label}
            </ListboxItem>
          ))}
        </Listbox>
        <Divider className="mb-3 mt-2" />
        <Accordion
          showDivider={false}
          itemClasses={{ trigger: "!py-0", content: "!py-0" }}
          className="gap-2"
          defaultSelectedKeys={accordionItems
            .filter(item => item.children.some(child => child.href === pathname))
            .map(item => item.key)}
        >
          {accordionItems.map(item => (
            <AccordionItem
              key={item.key}
              startContent={<item.Icon />}
              title={<Text size="4">{item.label}</Text>}
              classNames={{ base: "!pb-2" }}
              textValue={item.key}
            >
              {
                <Listbox
                  variant="flat"
                  selectionMode="single"
                  hideSelectedIcon
                  aria-label="Dashboard sub-items"
                >
                  {item.children.map((child, i) => (
                    <ListboxItem
                      key={child.href}
                      as={Link}
                      href={child.href}
                      startContent={<child.Icon />}
                      className={cn({
                        "bg-default/40 text-default-foreground transition-colors":
                          pathname === child.href,
                      })}
                    >
                      {child.label}
                    </ListboxItem>
                  ))}
                </Listbox>
              }
            </AccordionItem>
          ))}
        </Accordion>
      </ScrollArea>
      <ScrollArea className="h-[calc(100vh-81px)] w-full rounded-none pt-4">{children}</ScrollArea>
    </Flex>
  );
};

export default DashboardLayout;
