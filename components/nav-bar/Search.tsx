"use client";

import { createQueryString, deleteQueryString } from "@/hook/query-string-manipulation-hooks";
import { Input } from "@nextui-org/input";
import { SearchIcon } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

const Search = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState("");

  const handleSearch = () => {
    let query = new URLSearchParams(searchParams.toString());
    if (search === "") query = deleteQueryString(["search"], query);
    else query = createQueryString([{ name: "search", value: search }], query);
    router.push(`/products${query ? "?" + query.toString() : ""}`);
  };

  return (
    <form action={handleSearch} className="w-full">
      <Input
        variant="bordered"
        placeholder="Type to search..."
        className="hidden md:block"
        endContent={
          <button className="focus:outline-none" type="submit">
            <SearchIcon className="pointer-events-none text-2xl text-default-400" />
          </button>
        }
        value={search}
        onValueChange={setSearch}
      />
    </form>
  );
};

export default Search;
