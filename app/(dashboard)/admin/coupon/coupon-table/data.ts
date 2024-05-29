import { z } from "zod";

export const columns = [
  {
    name: "CODE",
    value: "code",
    sortable: true,
    align: "start",
  },
  {
    name: "VALUE",
    value: "value",
    sortable: true,
    align: "start",
  },
  {
    name: "START DATE",
    value: "startDate",
    sortable: true,
    align: "start",
  },
  {
    name: "END DATE",
    value: "endDate",
    sortable: true,
    align: "start",
  },
  {
    name: "TYPE",
    value: "type",
    sortable: true,
    align: "start",
  },
  {
    name: "USER",
    value: "user",
    sortable: true,
    align: "start",
  },
  {
    name: "MIN AMOUNT",
    value: "minAmount",
    sortable: true,
    align: "start",
  },
  {
    name: "MAX AMOUNT",
    value: "maxAmount",
    sortable: true,
    align: "start",
  },
  {
    name: "NAME",
    value: "name",
    sortable: true,
    align: "start",
  },
  {
    name: "DESCRIPTION",
    value: "description",
    sortable: true,
    align: "start",
  },
  {
    name: "CREATED AT",
    value: "createdAt",
    sortable: true,
    align: "start",
  },
  {
    name: "",
    value: "actions",
    sortable: false,
    align: "end",
  },
];

export interface TypeOption {
  label: "Admin" | "Vendor";
  value: "admin" | "vendor";
  icon: string;
  color: "primary" | "secondary" | "success" | "danger" | "default" | "warning";
}

export const statusOptions: TypeOption[] = [
  {
    label: "Admin",
    value: "admin",
    icon: "eos-icons:admin",
    color: "secondary",
  },
  {
    label: "Vendor",
    value: "vendor",
    icon: "wpf:administrator",
    color: "danger",
  },
];
