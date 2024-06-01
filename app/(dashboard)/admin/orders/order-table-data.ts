import { Colors } from "@/lib/types";
import { Status } from "@prisma/client";

export const INITIAL_VISIBLE_COLUMNS = ["code", "user", "bill", "status", "actions"];

export const columns = [
  { name: "CODE", value: "code", sortable: true, align: "start" },
  { name: "USER", value: "user", sortable: true, align: "start" },
  { name: "ADDRESS", value: "address", sortable: true, align: "start" },
  { name: "PHONE", value: "phone", sortable: true, align: "start" },
  { name: "EMAIL", value: "email", sortable: true, align: "start" },
  { name: "PAYMENT", value: "payment", sortable: true, align: "start" },
  { name: "BILL", value: "bill", sortable: true, align: "start" },
  { name: "DISCOUNT", value: "discount", sortable: true, align: "start" },
  { name: "STATUS", value: "status", sortable: true, align: "start" },
  { name: "COUPON", value: "coupon", sortable: true, align: "start" },
  { name: "CREATED AT", value: "createdAt", sortable: true, align: "start" },
  { name: "", value: "actions", sortable: false, align: "end" },
];

export interface StatusOption {
  icon: string;
  color: Colors;
}

export const statusOptions: { [key in Status]: StatusOption } = {
  pending: { icon: "solar:clock-circle-bold-duotone", color: "primary" },
  processing: { icon: "streamline:production-belt-solid", color: "secondary" },
  shipped: { icon: "flat-color-icons:shipped", color: "success" },
  delivered: { icon: "hugeicons:package-delivered", color: "success" },
  canceled: { icon: "pajamas:canceled-circle", color: "danger" },
};
