"use client";

import { createQueryString, deleteQueryString } from "@/hook/query-string-manipulation-hooks";
import { Select, SelectItem } from "@nextui-org/select";
import { Selection } from "@nextui-org/table";
import { ArrowUpDownIcon } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

const sortOpts = [
  { label: "Newest", value: "createdAt-desc" },
  { label: "Oldest", value: "createdAt-asc" },
  { label: "Title: A-Z", value: "name-asc" },
  { label: "Title: Z-A", value: "name-desc" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
  { label: "Popular", value: "sold-asc" },
  { label: "Rating", value: "rating-desc" },
];

const SortBy = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const onSelectionChange = (keys: Selection) => {
    if (keys === "all") return;
    const value = Array.from(keys)[0] as string;
    const sortBy = value.split("-")[0];
    const direction = value.split("-")[1];
    let query = new URLSearchParams(searchParams.toString());
    if (sortBy === "createdAt" && direction === "desc")
      query = deleteQueryString(["sortBy", "direction"], query);
    else
      query = createQueryString(
        [
          { name: "sortBy", value: sortBy },
          { name: "direction", value: direction },
        ],
        query
      );
    router.push(`${query ? "?" + query.toString() : ""}`);
  };

  return (
    <Select
      title="Sort by"
      aria-label="Sort by"
      variant="bordered"
      defaultSelectedKeys={[
        (searchParams.get("sortBy") || "createdAt") + (searchParams.get("direction") || "-desc"),
      ]}
      className="max-w-xs"
      startContent={<ArrowUpDownIcon />}
      disallowEmptySelection
      onSelectionChange={onSelectionChange}
    >
      {sortOpts.map(opt => (
        <SelectItem key={opt.value} value={opt.value}>
          {opt.label}
        </SelectItem>
      ))}
    </Select>
  );
};

export default SortBy;
