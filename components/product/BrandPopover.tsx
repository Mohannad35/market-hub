"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { createQueryString, deleteQueryString } from "@/hook/query-string-manipulation-hooks";
import { useQueryHook } from "@/hook/use-tanstack-hooks";
import { Modify } from "@/lib/types";
import { Avatar } from "@nextui-org/avatar";
import { Chip } from "@nextui-org/chip";
import { Button, Divider, Popover, PopoverContent, PopoverTrigger } from "@nextui-org/react";
import { Select, SelectedItems, SelectItem, SelectProps } from "@nextui-org/select";
import { Selection } from "@nextui-org/table";
import { Brand } from "@prisma/client";
import { useRouter, useSearchParams } from "next/navigation";
import { Icon as Iconify } from "@iconify/react";
import { ReactNode, useEffect, useState } from "react";

type BrandSelectProps = Modify<SelectProps, { uniqueKey: string; children?: ReactNode }>;
const BrandPopover = ({ uniqueKey, ...props }: BrandSelectProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const brandQuery = useQueryHook<{ items: Brand[]; count: number }>({
    url: "/api/brands",
    key: ["brands", "search"],
  });
  const [tempBrands, setTempBrands] = useState<string[]>(() => {
    const brands = searchParams.get("brands");
    return brands ? brands.split(",") : [];
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
    router.replace("?".concat(query.toString()));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [brands]);

  if (brandQuery.isLoading) return <Skeleton className="h-12 max-w-xs rounded-xl" />;
  else if (brandQuery.error) return <p>Error: {brandQuery.error?.message}</p>;
  else if (!brandQuery.isSuccess) return <p>No data found</p>;
  return (
    <Popover showArrow offset={10} placement="bottom">
      <PopoverTrigger>
        <Button
          variant="bordered"
          className="capitalize"
          endContent={<Iconify icon="line-md:chevron-down" />}
        >
          Brand
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[320px] p-0">
        {titleProps => (
          <div className="flex w-full flex-col gap-2 px-4 pb-1 pt-4">
            <p className="text-medium font-medium text-default-600" {...titleProps}>
              Select Brands
            </p>
            <div className="mt-2 flex w-full flex-row flex-wrap gap-2">
              {brandQuery.data.items.map(brand => (
                <Chip
                  key={brand.id}
                  radius="sm"
                  variant={tempBrands?.includes(brand.slug) ? "solid" : "flat"}
                  color={tempBrands?.includes(brand.slug) ? "primary" : "default"}
                  className="cursor-pointer transition-colors duration-200 ease-in-out"
                  onClick={e =>
                    tempBrands?.includes(brand.slug)
                      ? setTempBrands(old => old?.filter(slug => slug !== brand.slug))
                      : setTempBrands(old => (old ? [...old, brand.slug] : [brand.slug]))
                  }
                  avatar={<Avatar alt={brand.name} src={brand.image?.secure_url} />}
                >
                  {brand.name}
                </Chip>
              ))}
            </div>

            <Divider className="mt-3 bg-default-100" />

            <div className="flex w-full justify-end gap-2 py-2">
              <Button size="sm" variant="flat" color="default" onPress={() => setTempBrands([])}>
                Cancel
              </Button>
              <Button
                size="sm"
                variant="flat"
                color="secondary"
                onPress={() => setBrands(new Set(tempBrands))}
              >
                Apply
              </Button>
            </div>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};

export default BrandPopover;
