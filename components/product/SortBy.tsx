"use client";

import { createQueryString, deleteQueryString } from "@/hook/query-string-manipulation-hooks";
import { Select, SelectItem } from "@nextui-org/select";
import { Selection } from "@nextui-org/table";
import { ArrowUpDownIcon } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

const SortBy = ({ sortOpts }: { sortOpts: { label: string; value: string }[] }) => {
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
