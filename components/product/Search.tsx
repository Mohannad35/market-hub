"use client";

import { createQueryString, deleteQueryString } from "@/hook/query-string-manipulation-hooks";
import { Modify } from "@/lib/types";
import { Input, InputProps } from "@nextui-org/input";
import { SearchIcon } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

type SearchProps = Modify<InputProps, { api?: string; queryName: string }>;
const Search = ({ api, queryName, ...props }: SearchProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get(queryName) || "");

  const handleSearch = () => {
    let query = new URLSearchParams(searchParams.toString());
    if (search === "") query = deleteQueryString([queryName], query);
    else query = createQueryString([{ name: queryName, value: search }], query);
    if (typeof api === "string") router.push(api + "?".concat(query.toString()));
    else router.replace("?".concat(query.toString()));
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
        {...props}
      />
    </form>
  );
};

export default Search;
