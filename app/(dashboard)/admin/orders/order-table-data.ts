import { Status } from "@prisma/client";

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

export interface TypeOption {
  value: Status;
  icon: string;
  color: "primary" | "secondary" | "success" | "danger" | "default" | "warning";
}

export const statusOptions: TypeOption[] = [
  { value: "pending", icon: "eos-icons:admin", color: "secondary" },
  { value: "processing", icon: "wpf:administrator", color: "danger" },
  { value: "shipped", icon: "wpf:administrator", color: "danger" },
  { value: "delivered", icon: "wpf:administrator", color: "danger" },
  { value: "canceled", icon: "wpf:administrator", color: "danger" },
];
