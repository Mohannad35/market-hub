"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { createQueryString, deleteQueryString } from "@/hook/query-string-manipulation-hooks";
import { useQueryHook } from "@/hook/use-tanstack-hooks";
import { Modify } from "@/lib/types";
import { Autocomplete, AutocompleteItem, AutocompleteProps } from "@nextui-org/autocomplete";
import { Category } from "@prisma/client";
import { useRouter, useSearchParams } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";

type CategorySelectProps = Modify<
  AutocompleteProps,
  { uniqueKey: string; children?: ReactNode; defaultItems?: Category[]; items?: Category[] }
>;
const CategorySelect = ({ uniqueKey, ...props }: CategorySelectProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const categoriesQuery = useQueryHook<{ items: Category[]; count: number }>({
    url: "/api/categories",
    key: [uniqueKey],
  });
  const [category, setCategory] = useState<string | number>(() => {
    const category = searchParams.get("category");
    return category ? category : "";
  });

  useEffect(() => {
    let query = new URLSearchParams(searchParams.toString());
    if (!category || category === "") query = deleteQueryString(["category"], query);
    else query = createQueryString([{ name: "category", value: category.toString() }], query);
    router.replace("?".concat(query.toString()));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category]);

  if (categoriesQuery.isLoading) return <Skeleton className="h-12 max-w-[200px] rounded-xl" />;
  else if (categoriesQuery.error) return <p>Error: {categoriesQuery.error?.message}</p>;
  else if (!categoriesQuery.isSuccess || !categoriesQuery.data) return <p>No data found</p>;
  return (
    <Autocomplete
      aria-label="Category"
      variant="bordered"
      defaultItems={categoriesQuery.data.items}
      placeholder="Category"
      classNames={{
        base: "max-w-[200px]",
        popoverContent: "w-[320px]",
        listboxWrapper: "w-[320px]",
      }}
      selectedKey={category}
      onSelectionChange={setCategory}
      {...props}
    >
      {category => <AutocompleteItem key={category.path}>{category.name}</AutocompleteItem>}
    </Autocomplete>
  );
};

export default CategorySelect;
