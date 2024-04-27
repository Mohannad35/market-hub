"use client";

import { createQueryString, deleteQueryString } from "@/hook/query-string-manipulation-hooks";
import { useBrands, useCategories } from "@/hook/use-query-hooks";
import { Autocomplete, AutocompleteItem } from "@nextui-org/autocomplete";
import { Avatar } from "@nextui-org/avatar";
import { Card } from "@nextui-org/card";
import { Chip } from "@nextui-org/chip";
import { Select, SelectedItems, SelectItem } from "@nextui-org/select";
import { Selection } from "@nextui-org/table";
import { Brand } from "@prisma/client";
import { Flex } from "@radix-ui/themes";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const FilterSidebar = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const brandQuery = useBrands();
  const categoriesQuery = useCategories();
  const [category, setCategory] = useState<string | number>();
  const [brands, setBrands] = useState<Selection>(new Set());

  useEffect(() => {
    let query = new URLSearchParams(searchParams.toString());
    if (!category || category === "") query = deleteQueryString(["category"], query);
    else query = createQueryString([{ name: "category", value: category.toString() }], query);
    router.push(`/products${query ? "?" + query.toString() : ""}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category]);

  useEffect(() => {
    let query = new URLSearchParams(searchParams.toString());
    if (!brands || brands === "all" || brands.size < 1)
      query = deleteQueryString(["brands"], query);
    else
      query = createQueryString([{ name: "brands", value: Array.from(brands).join(",") }], query);
    router.push(`/products${query ? "?" + query.toString() : ""}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [brands]);

  if (brandQuery.isLoading || categoriesQuery.isLoading) return <p>Loading...</p>;
  else if (brandQuery.error || categoriesQuery.error)
    return <p>Error: {brandQuery.error?.message || categoriesQuery.error?.message}</p>;
  else if (!brandQuery.isSuccess || !categoriesQuery.isSuccess) return <p>No data found</p>;
  return (
    <Card
      shadow="none"
      radius="none"
      className="sticky h-full min-h-screen min-w-[15rem] max-w-[20rem] border-none bg-transparent ps-3"
    >
      <Flex direction="column" width="100%" gapY="5">
        <Autocomplete
          label="Category"
          variant="bordered"
          defaultItems={categoriesQuery.data}
          placeholder="Filter with..."
          className="max-w-xs"
          selectedKey={category}
          onSelectionChange={setCategory}
        >
          {item => <AutocompleteItem key={item.slug}>{item.name}</AutocompleteItem>}
        </Autocomplete>

        <Select
          isMultiline
          items={brandQuery.data}
          label="Brands"
          placeholder="Filter with..."
          variant="bordered"
          selectionMode="multiple"
          labelPlacement="inside"
          classNames={{
            base: "max-w-xs",
            trigger: "min-h-12 py-2",
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
                  <Avatar alt={brand.name} className="flex-shrink-0" size="sm" src={brand.image} />
                )}
                <div className="flex flex-col">
                  <span className="text-small">{brand.name}</span>
                </div>
              </div>
            </SelectItem>
          )}
        </Select>
      </Flex>
    </Card>
  );
};

export default FilterSidebar;
