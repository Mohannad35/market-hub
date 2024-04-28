"use client";

import { createQueryString, deleteQueryString } from "@/hook/query-string-manipulation-hooks";
import { Button } from "@nextui-org/button";
import { Pagination as NextPagination } from "@nextui-org/pagination";
import { Flex } from "@radix-ui/themes";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const Pagination = ({ count }: { count: number }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [currentPage, setCurrentPage] = useState(() =>
    searchParams.has("page") ? parseInt(searchParams.get("page") as string) : 1
  );
  const [pageSize, setPageSize] = useState(6);

  useEffect(() => {
    let query = new URLSearchParams(searchParams.toString());
    if (currentPage === 1) query = deleteQueryString(["page"], query);
    else query = createQueryString([{ name: "page", value: currentPage.toString() }], query);
    router.push(query ? "?" + query : "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  useEffect(() => {
    let query = new URLSearchParams(searchParams.toString());
    if (pageSize === 20) query = deleteQueryString(["pageSize"], query);
    else query = createQueryString([{ name: "pageSize", value: pageSize.toString() }], query);
    router.push(query ? "?" + query : "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageSize]);
  const total = Math.ceil(count / pageSize);
  if (total <= 1) return <></>;
  return (
    <Flex gap="2">
      <Button
        isIconOnly
        isDisabled={currentPage === 1}
        color="default"
        variant="light"
        className="h-9"
        onPress={() => setCurrentPage(currentPage => Math.max(1, currentPage - 1))}
      >
        <ChevronLeftIcon />
      </Button>
      <NextPagination
        color="primary"
        total={total}
        page={currentPage}
        onChange={setCurrentPage}
        className="hidden lg:flex"
      />
      <Button isIconOnly color="primary" className="flex h-9 lg:hidden">
        {currentPage}
      </Button>
      <Button
        isIconOnly
        isDisabled={currentPage === 10}
        color="default"
        variant="light"
        className="h-9"
        onPress={() => setCurrentPage(currentPage => Math.min(10, currentPage + 1))}
      >
        <ChevronRightIcon />
      </Button>
    </Flex>
  );
};

export default Pagination;
