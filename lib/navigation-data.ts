export const listItems = (username: string) => [
  {
    key: "dashboard",
    label: "Dashboard",
    href: `/${username}/dashboard`,
    icon: "tabler:layout-dashboard-filled",
  },
  {
    key: "profile",
    label: "Profile",
    href: `/${username}`,
    icon: "solar:user-bold-duotone",
  },
  {
    key: "settings",
    label: "Settings",
    href: `/${username}/settings`,
    icon: "solar:settings-bold-duotone",
  },
  {
    key: "security",
    label: "Security",
    href: `/${username}/security`,
    icon: "mdi:security-account",
  },
];

export const accordionItems = (username: string) => [
  {
    key: "new",
    label: "New",
    icon: "line-md:plus-square-twotone",
    children: [
      { label: "Product", href: "/admin/products/new", icon: "hugeicons:product-loading" },
      { label: "Category", href: "/admin/categories/new", icon: "carbon:category-new" },
      { label: "Brand", href: "/admin/brands/new", icon: "fluent-mdl2:verified-brand-solid" },
    ],
  },
  {
    key: "list",
    label: "List",
    icon: "mage:dashboard-fill",
    children: [
      { label: "Products", href: "/admin/products", icon: "fluent-mdl2:product-variant" },
      { label: "Categories", href: "/admin/categories", icon: "carbon:category" },
      { label: "Brands", href: "/admin/brands", icon: "fluent-mdl2:verified-brand-solid" },
    ],
  },
];
