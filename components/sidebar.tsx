"use client";

import { Card, CardBody, CardHeader } from "@nextui-org/card";
import { Listbox, ListboxItem } from "@nextui-org/listbox";
import { Accordion, AccordionItem } from "@nextui-org/accordion";
import { cn, Selection } from "@nextui-org/react";

interface SidebarItem {
  text: string;
  href: string;
  children?: SidebarItem[];
}

interface SidebarProps {
  title?: string | undefined;
  items: SidebarItem[];
  selectedKeys: string[];
  setSelectedKeys: (keys: Selection) => void;
  subOpen: string;
  handleSubOpen: (value: string, href: string) => void;
}

export function Sidebar({
  title,
  items,
  selectedKeys,
  setSelectedKeys,
  subOpen,
  handleSubOpen,
}: SidebarProps) {
  return (
    <Card className="shadow-right sticky top-[72px] h-full min-h-screen w-full max-w-[20rem] rounded-none border-none shadow-none dark:bg-neutral-950">
      {title && <CardHeader className="pb-3 text-lg">{title}</CardHeader>}

      {items && (
        <CardBody className={`${title ? "" : "p-6"}`}>
          <Accordion
            hideIndicator
            selectedKeys={selectedKeys}
            onSelectionChange={setSelectedKeys}
            className="w-full"
          >
            {items.map((item, index) => (
              <AccordionItem key={index} title={item.text}>
                {item.children ? (
                  <Listbox>
                    {item.children.map((itm, index) => (
                      <ListboxItem
                        key={index}
                        onClick={() => handleSubOpen(itm.text, itm.href)}
                        className={cn(
                          "hover:bg-neutral-200 dark:hover:bg-neutral-800",
                          subOpen === itm.text ? "bg-neutral-200 dark:bg-neutral-800" : ""
                        )}
                      >
                        <span className="dark:text-blue-neutral-300">{itm.text}</span>
                      </ListboxItem>
                    ))}
                  </Listbox>
                ) : null}
              </AccordionItem>
            ))}
          </Accordion>
        </CardBody>
      )}
    </Card>
  );
}
