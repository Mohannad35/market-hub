"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { accordionItems, listItems } from "@/lib/navigation-data";
import { Accordion, AccordionItem, cn, Divider, Listbox, ListboxItem } from "@nextui-org/react";
import { Flex, Text } from "@radix-ui/themes";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";
import { Icon as Iconify } from "@iconify/react";
import { useSession } from "next-auth/react";

const DashboardLayout = ({ children }: Readonly<{ children: ReactNode }>) => {
  const pathname = usePathname();
  const { data, status } = useSession();

  if (status === "loading") return null;
  if (!data?.user) return null;
  const { username } = data.user;

  return (
    <Flex width="100%" pt="4">
      <ScrollArea className="h-[calc(100vh-70px)] w-[20rem] rounded-none px-4">
        <Listbox variant="flat" selectionMode="single" hideSelectedIcon aria-label="Dashboard">
          {listItems(username).map(({ key, label, href, icon }, i) => (
            <ListboxItem
              key={key}
              as={Link}
              href={href}
              startContent={<Iconify icon={icon} fontSize={24} />}
              className={cn({
                "bg-default/40 text-default-foreground transition-colors": pathname === href,
              })}
            >
              {label}
            </ListboxItem>
          ))}
        </Listbox>
        <Divider className="mb-3 mt-2" />
        <Accordion
          showDivider={false}
          itemClasses={{ trigger: "!py-0", content: "!py-0" }}
          className="gap-2"
          defaultSelectedKeys={accordionItems(username)
            .filter(item => item.children.some(child => child.href === pathname))
            .map(item => item.key)}
        >
          {accordionItems(username).map(({ key, label, icon, children }) => (
            <AccordionItem
              key={key}
              startContent={<Iconify icon={icon} fontSize={24} />}
              title={<Text size="4">{label}</Text>}
              classNames={{ base: "!pb-2" }}
              textValue={key}
            >
              {
                <Listbox
                  variant="flat"
                  selectionMode="single"
                  hideSelectedIcon
                  aria-label="Dashboard sub-items"
                >
                  {children.map(({ href, label, icon }, i) => (
                    <ListboxItem
                      key={href}
                      as={Link}
                      href={href}
                      startContent={<Iconify icon={icon} fontSize={24} />}
                      className={cn({
                        "bg-default/40 text-default-foreground transition-colors":
                          pathname === href,
                      })}
                    >
                      {label}
                    </ListboxItem>
                  ))}
                </Listbox>
              }
            </AccordionItem>
          ))}
        </Accordion>
      </ScrollArea>
      {/* <ScrollArea className="h-[calc(100vh-70px)] w-full rounded-none pt-4">{children}</ScrollArea> */}
      {children}
    </Flex>
  );
};

export default DashboardLayout;
