import { Colors } from "@/lib/types";
import { CouponType, Role } from "@prisma/client";

export const INITIAL_VISIBLE_COLUMNS = ["code", "value", "startDate", "endDate", "type", "actions"];

export const columns = [
  { name: "CODE", value: "code", sortable: true, align: "start" },
  { name: "VALUE", value: "value", sortable: true, align: "start" },
  { name: "START DATE", value: "startDate", sortable: true, align: "start" },
  { name: "END DATE", value: "endDate", sortable: true, align: "start" },
  { name: "TYPE", value: "type", sortable: true, align: "start" },
  { name: "USER", value: "user", sortable: true, align: "start" },
  { name: "MIN AMOUNT", value: "minAmount", sortable: true, align: "start" },
  { name: "MAX AMOUNT", value: "maxAmount", sortable: true, align: "start" },
  { name: "NAME", value: "name", sortable: true, align: "start" },
  { name: "DESCRIPTION", value: "description", sortable: true, align: "start" },
  { name: "CREATED AT", value: "createdAt", sortable: true, align: "start" },
  { name: "", value: "actions", sortable: false, align: "end" },
];

export interface TypeOption {
  icon: string;
  color: Colors;
}

export const typeOptions: { [key in CouponType]: TypeOption } = {
  admin: { icon: "solar:shield-user-bold-duotone", color: "danger" },
  vendor: { icon: "solar:user-check-bold-duotone", color: "secondary" },
};
