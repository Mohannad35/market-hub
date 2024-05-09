import {
  CircleUserRoundIcon,
  LayoutDashboardIcon,
  LayoutGridIcon,
  PlusCircle,
  Settings2Icon,
} from "lucide-react";
import { BiCategory } from "react-icons/bi";
import { MdNotifications } from "react-icons/md";
import { PiPasswordBold } from "react-icons/pi";
import { TbBrandProducthunt, TbCategoryPlus } from "react-icons/tb";
import { TiSortAlphabeticallyOutline } from "react-icons/ti";

export const listItems = [{ label: "Dashboard", href: "/dashboard", Icon: LayoutDashboardIcon }];

export const accordionItems = [
  {
    key: "new",
    label: "New",
    Icon: PlusCircle,
    children: [
      { label: "Product", href: "/dashboard/products/new", Icon: TbBrandProducthunt },
      { label: "Category", href: "/dashboard/categories/new", Icon: TbCategoryPlus },
      {
        label: "Brand",
        href: "/dashboard/brands/new",
        Icon: TiSortAlphabeticallyOutline,
      },
    ],
  },
  {
    key: "list",
    label: "List",
    Icon: LayoutGridIcon,
    children: [
      { label: "Products", href: "/dashboard/products", Icon: TbBrandProducthunt },
      { label: "Categories", href: "/dashboard/categories", Icon: BiCategory },
      {
        label: "Brands",
        href: "/dashboard/brands",
        Icon: TiSortAlphabeticallyOutline,
      },
    ],
  },
  {
    key: "settings",
    label: "Settings",
    Icon: Settings2Icon,
    children: [
      {
        label: "Profile",
        href: "/dashboard/settings/profile",
        Icon: CircleUserRoundIcon,
      },
      {
        label: "Password",
        href: "/dashboard/settings/password",
        Icon: PiPasswordBold,
      },
      {
        label: "Notifications",
        href: "/dashboard/settings/notifications",
        Icon: MdNotifications,
      },
    ],
  },
];
