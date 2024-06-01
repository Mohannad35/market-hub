import { Colors } from "@/lib/types";
import { Role } from "@prisma/client";

export const INITIAL_VISIBLE_COLUMNS = [
  "user",
  "role",
  "username",
  "verified",
  "createdAt",
  "actions",
];

export const columns = [
  { name: "USER", value: "user", sortable: true, align: "start" },
  { name: "VERIFIED", value: "verified", sortable: true, align: "start" },
  { name: "ROLE", value: "role", sortable: true, align: "start" },
  { name: "USERNAME", value: "username", sortable: true, align: "start" },
  { name: "GENDER", value: "gender", sortable: true, align: "start" },
  { name: "PHONE", value: "phone", sortable: true, align: "start" },
  { name: "BIRTHDAY", value: "birthday", sortable: true, align: "start" },
  { name: "ADDRESS", value: "address", sortable: true, align: "start" },
  { name: "BUSINESS ADDRESS", value: "businessAddress", sortable: true, align: "start" },
  { name: "WEBSITE ADDRESS", value: "websiteAddress", sortable: true, align: "start" },
  { name: "BANNED", value: "banned", sortable: true, align: "start" },
  { name: "CREATED AT", value: "createdAt", sortable: true, align: "start" },
  { name: "", value: "actions", sortable: false, align: "end" },
];

export interface RoleOption {
  icon: string;
  color: Colors;
}

export const roleOptions: { [key in Role]: RoleOption } = {
  user: { icon: "solar:user-bold-duotone", color: "default" },
  admin: { icon: "solar:shield-user-bold-duotone", color: "danger" },
  support: { icon: "solar:user-speak-bold-duotone", color: "warning" },
  vendor: { icon: "solar:user-check-bold-duotone", color: "secondary" },
};
