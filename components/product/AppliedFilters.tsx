"use client";

import { Chip } from "@nextui-org/react";
import { Flex } from "@radix-ui/themes";
import { startCase } from "lodash";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { Icon as Iconify } from "@iconify/react";

const AppliedFilters = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const chips = useMemo(() => {
    const brands = searchParams.get("brands")?.split(","); // brand slug
    const category = searchParams.get("category"); // category slug
    const minPrice = searchParams.get("minPrice"); // number
    const maxPrice = searchParams.get("maxPrice"); // number
    const priceRange = minPrice && maxPrice ? `${minPrice} - ${maxPrice}` : null;
    const chips = [];
    if (brands)
      chips.push(
        ...brands.map(brand => ({ key: brand, value: startCase(brand.replace("-", " ")) }))
      );
    if (category)
      chips.push({ key: "category", value: startCase(decodeURI(category).split("/").pop()) });
    if (priceRange) chips.push({ key: "price", value: priceRange });
    return chips;
  }, [searchParams]);

  const handleClose = (key: string) => {
    const query = new URLSearchParams(searchParams.toString());
    if (key === "category") query.delete("category");
    else if (key === "price") {
      query.delete("minPrice");
      query.delete("maxPrice");
    } else {
      const brands = query.get("brands")?.split(",");
      if (brands) {
        if (brands.length === 1 && key === brands[0]) query.delete("brands");
        else query.set("brands", brands.filter(brand => brand !== key).join(","));
      }
    }
    router.replace("?".concat(query.toString()));
  };

  return (
    <Flex width="100%" justify="between">
      <Flex width="100%" wrap="wrap" gap="2">
        {chips.map(({ key, value }) => (
          <Chip key={key} onClose={() => handleClose(key)} variant="flat">
            {value}
          </Chip>
        ))}
      </Flex>
      {/* reset filters */}
      <Chip
        variant="flat"
        onClick={() => router.replace("?")}
        className="cursor-pointer"
        startContent={<Iconify icon="mdi:filter-off" />}
      >
        Reset
      </Chip>
    </Flex>
  );
};

export default AppliedFilters;
