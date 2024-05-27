export const listItems = (username: string) => [
  {
    key: "dashboard",
    label: "Dashboard",
    href: `/user/${username}/dashboard`,
    icon: "tabler:layout-dashboard-filled",
  },
  {
    key: "profile",
    label: "Profile",
    href: `/user/${username}`,
    icon: "solar:user-bold-duotone",
  },
  {
    key: "orders",
    label: "Orders",
    href: `/user/${username}/orders`,
    icon: "material-symbols:orders-rounded",
  },
  {
    key: "wishlist",
    label: "Wishlist",
    href: `/user/${username}/wishlist`,
    icon: "solar:list-heart-minimalistic-bold-duotone",
  },
  {
    key: "settings",
    label: "Settings",
    href: `/user/${username}/settings`,
    icon: "solar:settings-bold-duotone",
  },
  {
    key: "security",
    label: "Security",
    href: `/user/${username}/security`,
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
      { label: "Coupon", href: "/admin/coupon/new", icon: "mdi:coupon" },
    ],
  },
  {
    key: "manage",
    label: "Manage",
    icon: "mage:dashboard-fill",
    children: [
      { label: "Products", href: "/admin/products", icon: "fluent-mdl2:product-variant" },
      { label: "Categories", href: "/admin/categories", icon: "carbon:category" },
      { label: "Brands", href: "/admin/brands", icon: "fluent-mdl2:verified-brand-solid" },
      { label: "Coupons", href: "/admin/coupon", icon: "mdi:coupon" },
      { label: "Users", href: "/admin/users", icon: "solar:users-group-two-rounded-bold-duotone" },
      { label: "Orders", href: "/admin/orders", icon: "material-symbols:orders-rounded" },
    ],
  },
];
