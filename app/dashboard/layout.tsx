"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Accordion, AccordionItem, cn, Divider, Listbox, ListboxItem } from "@nextui-org/react";
import { Flex, Text } from "@radix-ui/themes";
import {
  CircleUserRoundIcon,
  LayoutDashboardIcon,
  LayoutGridIcon,
  PlusCircle,
  Settings2Icon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";
import { BiCategory } from "react-icons/bi";
import { MdNotifications } from "react-icons/md";
import { PiPasswordBold } from "react-icons/pi";
import { TbBrandProducthunt, TbCategoryPlus } from "react-icons/tb";
import { TiSortAlphabeticallyOutline } from "react-icons/ti";

const listItems = [
  { label: "Dashboard", href: "/dashboard", icon: <LayoutDashboardIcon size={20} /> },
];

const accordionItems = [
  {
    key: "new",
    label: "New",
    icon: <PlusCircle size={20} />,
    children: [
      { label: "Product", href: "/dashboard/products/new", icon: <TbBrandProducthunt size={20} /> },
      { label: "Category", href: "/dashboard/categories/new", icon: <TbCategoryPlus size={20} /> },
      {
        label: "Brand",
        href: "/dashboard/brands/new",
        icon: <TiSortAlphabeticallyOutline size={20} />,
      },
    ],
  },
  {
    key: "list",
    label: "List",
    icon: <LayoutGridIcon size={20} />,
    children: [
      { label: "Products", href: "/dashboard/products", icon: <TbBrandProducthunt size={20} /> },
      { label: "Categories", href: "/dashboard/categories", icon: <BiCategory /> },
      {
        label: "Brands",
        href: "/dashboard/brands",
        icon: <TiSortAlphabeticallyOutline size={20} />,
      },
    ],
  },
  {
    key: "settings",
    label: "Settings",
    icon: <Settings2Icon size={20} />,
    children: [
      {
        label: "Profile",
        href: "/dashboard/settings/profile",
        icon: <CircleUserRoundIcon size={20} />,
      },
      {
        label: "Password",
        href: "/dashboard/settings/password",
        icon: <PiPasswordBold size={20} />,
      },
      {
        label: "Notifications",
        href: "/dashboard/settings/notifications",
        icon: <MdNotifications size={20} />,
      },
    ],
  },
];

const DashboardLayout = ({ children }: Readonly<{ children: ReactNode }>) => {
  const pathname = usePathname();

  return (
    <Flex width="100%">
      <ScrollArea className="h-[calc(100vh-81px)] w-[20rem] rounded-none border-r p-3">
        <Listbox
          variant="flat"
          selectionMode="single"
          hideSelectedIcon
          aria-label="Dashboard items"
        >
          {listItems.map((item, i) => (
            <ListboxItem
              key={item.href}
              as={Link}
              href={item.href}
              startContent={item.icon}
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
              startContent={item.icon}
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
                      startContent={child.icon}
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
