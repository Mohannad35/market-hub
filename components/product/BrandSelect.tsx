"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { createQueryString, deleteQueryString } from "@/hook/query-string-manipulation-hooks";
import { useQueryHook } from "@/hook/use-tanstack-hooks";
import { Modify } from "@/lib/types";
import { Avatar } from "@nextui-org/avatar";
import { Chip } from "@nextui-org/chip";
import { Select, SelectedItems, SelectItem, SelectProps } from "@nextui-org/select";
import { Selection } from "@nextui-org/table";
import { Brand } from "@prisma/client";
import { useRouter, useSearchParams } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";

type BrandSelectProps = Modify<SelectProps, { uniqueKey: string; children?: ReactNode }>;
const BrandSelect = ({ uniqueKey, ...props }: BrandSelectProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const brandQuery = useQueryHook<{ items: Brand[]; count: number }>({
    url: "/api/brands",
    key: ["brands", "search"],
  });
  const [brands, setBrands] = useState<Selection>(() => {
    const brands = searchParams.get("brands");
    return brands ? new Set(brands.split(",")) : new Set();
  });

  useEffect(() => {
    let query = new URLSearchParams(searchParams.toString());
    if (!brands || brands === "all" || brands.size < 1)
      query = deleteQueryString(["brands"], query);
    else
      query = createQueryString([{ name: "brands", value: Array.from(brands).join(",") }], query);
    router.push(`${query ? "?" + query.toString() : ""}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [brands]);

  if (brandQuery.isLoading) return <Skeleton className="h-12 max-w-xs rounded-xl" />;
  else if (brandQuery.error) return <p>Error: {brandQuery.error?.message}</p>;
  else if (!brandQuery.isSuccess) return <p>No data found</p>;
  return (
    <Select
      isMultiline
      items={brandQuery.data.items}
      label="Brands"
      placeholder="Filter with..."
      variant="bordered"
      selectionMode="multiple"
      labelPlacement="inside"
      classNames={{
        base: "max-w-xs",
        trigger: "min-h-12",
        label: "min-h-5",
      }}
      selectedKeys={brands}
      onSelectionChange={setBrands}
      renderValue={(items: SelectedItems<Brand>) => {
        return (
          <div className="flex flex-wrap gap-2">
            {items.map(item => (
              <Chip key={item.key}>{item.data!.name}</Chip>
            ))}
          </div>
        );
      }}
    >
      {brand => (
        <SelectItem key={brand.slug} textValue={brand.name}>
          <div className="flex items-center gap-2">
            {brand.image && (
              <Avatar
                alt={brand.name}
                className="flex-shrink-0"
                size="sm"
                src={brand.image.secure_url}
              />
            )}
            <div className="flex flex-col">
              <span className="text-small">{brand.name}</span>
            </div>
          </div>
        </SelectItem>
      )}
    </Select>
  );
};

export default BrandSelect;
