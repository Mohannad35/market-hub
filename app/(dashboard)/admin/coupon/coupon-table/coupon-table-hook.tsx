"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { CouponWithUser } from "@/lib/types";
import { couponQuerySchema } from "@/lib/validation/coupon-schema";
import { Button } from "@nextui-org/button";
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@nextui-org/dropdown";
import { Link } from "@nextui-org/link";
import { User } from "@nextui-org/react";
import { Selection, SortDescriptor } from "@nextui-org/table";
import { useDisclosure } from "@nextui-org/use-disclosure";
import { Coupon } from "@prisma/client";
import { Flex, Text } from "@radix-ui/themes";
import { QueryObserverResult, RefetchOptions } from "@tanstack/react-query";
import { capitalize, difference } from "lodash";
import { useSession } from "next-auth/react";
import { useTheme } from "next-themes";
import { useRouter, useSearchParams } from "next/navigation";
import { ChangeEvent, Key, useCallback, useEffect, useRef, useState } from "react";
import { HiDotsHorizontal } from "react-icons/hi";
import { columns } from "./data";
import { useMutationHook } from "@/hook/use-tanstack-hooks";
import { toast } from "sonner";
import moment from "moment";

const INITIAL_VISIBLE_COLUMNS = ["code", "value", "startDate", "endDate", "type", "actions"];

const DataTableHook = (
  refetch: (options?: RefetchOptions) => Promise<QueryObserverResult<Coupon[], Error>>
) => {
  const router = useRouter();
  const { status } = useSession();
  const searchParams = useSearchParams();
  const { theme, systemTheme } = useTheme();
  const [coupon, setCoupon] = useState<Coupon | undefined>(undefined);
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]));
  const [isLoadingNew, setIsLoadingNew] = useState(false);
  const [isLoadingRefresh, setIsLoadingRefresh] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState<Selection>(new Set(INITIAL_VISIBLE_COLUMNS));
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(1);
  const [filterValue, setFilterValue] = useState(() => {
    if (!searchParams.has("search")) return "";
    const valid = couponQuerySchema.safeParse({ search: searchParams.get("search") });
    if (!valid.success) return "";
    return valid.data.search;
  });
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>(() => {
    if (!searchParams.has("sortBy")) return { column: "createdAt", direction: "descending" };
    const valid = couponQuerySchema.safeParse({
      sortBy: searchParams.get("sortBy"),
      direction: searchParams.get("direction"),
    });
    if (!valid.success) return { column: "createdAt", direction: "ascending" };
    const { direction, sortBy } = valid.data;
    return {
      column: sortBy,
      direction: ["asc", "ascending"].includes(direction!) ? "ascending" : "descending",
    };
  });
  const [actions, setActions] = useState(() => {
    if (status === "authenticated") {
      return [
        { key: "view", label: "View" },
        { key: "edit", label: "Edit" },
        { key: "delete", label: "Delete" },
      ];
    }
    return [{ key: "view", label: "View" }];
  });
  // const toastId = useRef<Id | null>(null);
  const {
    isOpen: isOpenDelete,
    onOpen: onOpenDelete,
    onOpenChange: onOpenChangeDelete,
    onClose: onCloseDelete,
  } = useDisclosure();
  const delCouponMutation = useMutationHook<Coupon, { code: string }>(
    `/api/coupon`,
    ["delCoupon"],
    "DELETE"
  );

  const onClickRefresh = useCallback(async () => {
    setIsLoadingRefresh(true);
    await refetch();
    setIsLoadingRefresh(false);
  }, [refetch]);

  useEffect(() => {
    onClickRefresh();
  }, [onClickRefresh, searchParams]);

  useEffect(() => {
    if (status === "authenticated")
      setActions([
        { key: "view", label: "View" },
        { key: "edit", label: "Edit" },
        { key: "delete", label: "Delete" },
      ]);
    else setActions([{ key: "view", label: "View" }]);
  }, [status]);

  const onAction = (key: Key, coupon: Coupon) => {
    switch (key) {
      case "view":
        router.push(`/admin/coupon/${coupon.code}`);
        break;
      case "edit":
        router.push(`/admin/coupon/${coupon.code}/edit`);
        break;
      case "delete":
        setCoupon(coupon);
        onOpenDelete();
        break;
      default:
        break;
    }
  };

  const renderCell = (
    coupon: CouponWithUser,
    columnKey: Key
  ): { content: JSX.Element; textValue: string } => {
    const {
      code,
      value,
      startDate,
      endDate,
      user,
      type,
      name,
      description,
      createdAt,
      minAmount,
      maxAmount,
    } = coupon;
    const cellValue = coupon[columnKey as keyof Coupon];
    switch (columnKey) {
      case "code":
        return {
          content: (
            <Flex>
              <Link href={`/coupon/${coupon.code}`} color="primary" underline="hover">
                <Text truncate weight="medium" wrap="nowrap" className="max-w-[300px]">
                  {code}
                </Text>
              </Link>
            </Flex>
          ),
          textValue: String(code),
        };
      case "value":
        return {
          content: (
            <Flex>
              <Text weight="medium" wrap="nowrap">
                {value.toString()}
              </Text>
            </Flex>
          ),
          textValue: String(value),
        };
      case "type":
        return {
          content: (
            <Flex>
              <Text weight="medium" wrap="nowrap">
                {capitalize(type)}
              </Text>
            </Flex>
          ),
          textValue: String(value),
        };
      case "user":
        return {
          content: (
            <Flex>
              <User
                name={user.name}
                // className="flex-nowrap whitespace-nowrap text-nowrap"
                avatarProps={{
                  radius: "full",
                  size: "sm",
                  src: user.image?.secure_url || user.avatar || undefined,
                }}
                classNames={{ name: "flex-nowrap text-nowrap whitespace-nowrap" }}
                description={capitalize(user.role)}
              />
            </Flex>
          ),
          textValue: String(value),
        };
      case "minAmount":
        return {
          content: (
            <Flex>
              <Text weight="medium" wrap="nowrap">
                {minAmount.toString()}
              </Text>
            </Flex>
          ),
          textValue: String(minAmount),
        };
      case "maxAmount":
        return {
          content: (
            <Flex>
              <Text weight="medium" wrap="nowrap">
                {maxAmount ? maxAmount.toString() : "N/A"}
              </Text>
            </Flex>
          ),
          textValue: String(maxAmount),
        };
      case "name":
        return {
          content: (
            <Flex>
              <Text truncate wrap="nowrap" className="max-w-[300px]">
                {name ? name : "N/A"}
              </Text>
            </Flex>
          ),
          textValue: String(name),
        };
      case "description":
        return {
          content: (
            <Flex>
              <Text truncate wrap="nowrap" className="max-w-[400px]">
                {description ? description : "N/A"}
              </Text>
            </Flex>
          ),
          textValue: String(description),
        };
      case "startDate":
        return {
          content: (
            <Text weight="medium" wrap="nowrap">
              <span>{moment(startDate).format("MMM, DD YYYY")}</span>
            </Text>
          ),
          textValue: moment(startDate).format("MMM, DD YYYY"),
        };
      case "endDate":
        return {
          content: (
            <Text weight="medium" wrap="nowrap">
              <span>{moment(endDate).format("MMM, DD YYYY")}</span>
            </Text>
          ),
          textValue: moment(endDate).format("MMM, DD YYYY"),
        };
      case "createdAt":
        return {
          content: (
            <Text weight="medium" wrap="nowrap">
              <span>{moment(createdAt).format("MMM, DD YYYY")}</span>
            </Text>
          ),
          textValue: moment(createdAt).format("MMM, DD YYYY"),
        };
      case "actions":
        return {
          content: (
            <div className="flex justify-end">
              <Dropdown className="">
                <DropdownTrigger>
                  <Button isIconOnly radius="full" size="sm" variant="light">
                    <HiDotsHorizontal size={20} className="text-muted-foreground" />
                  </Button>
                </DropdownTrigger>
                <DropdownMenu items={actions} onAction={key => onAction(key, coupon)}>
                  {({ key, label }) => (
                    <DropdownItem
                      key={key}
                      color={key === "delete" ? "danger" : "default"}
                      className={key === "delete" ? "text-danger" : ""}
                    >
                      {label}
                    </DropdownItem>
                  )}
                </DropdownMenu>
              </Dropdown>
            </div>
          ),
          textValue: "actions",
        };
      default:
        return { content: <div>{String(cellValue)}</div>, textValue: String(cellValue) };
    }
  };

  const onRowsPerPageChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setRowsPerPage(Number(e.target.value));
    setPage(1);
  };

  const onSearchChange = (value?: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (!value || value === "") {
      setFilterValue("");
      setPage(1);
      const query = deleteQueryString(["search"], params);
      return router.replace("/admin/coupon" + (query && query.length > 0) ? "?" + query : "");
    } else if (value) {
      setFilterValue(value);
      setPage(1);
      const query = createQueryString([{ name: "search", value }], params);
      return router.replace("/admin/coupon?" + query);
    }
  };

  const onPressNew = () => {
    setIsLoadingNew(true);
    router.push("/admin/coupon/new");
  };

  const headerColumns =
    visibleColumns === "all"
      ? columns
      : columns.filter(column => Array.from(visibleColumns).includes(column.value));

  const loadingContent = (
    <Flex direction={"column"} width={"100%"} height={"100%"}>
      <Flex
        direction={"column"}
        width={"100%"}
        justify={"between"}
        mt={"65px"}
        px={"20px"}
        pt={"10px"}
        pb={"20px"}
        gap={"28px"}
        className="z-10 bg-neutral-900"
      >
        {[...new Array(rowsPerPage)].map((_, index) => (
          <Skeleton key={index} className="h-[20px] w-full rounded-lg" />
        ))}
      </Flex>
    </Flex>
  );

  const handleDelete = async () => {
    if (!coupon) return;
    onCloseDelete();
    const promise = new Promise<Coupon>(async (resolve, reject) =>
      delCouponMutation.mutateAsync({ code: coupon.code }).then(resolve).catch(reject)
    );
    toast.promise(promise, {
      loading: "Deleting coupon...",
      success(data) {
        setTimeout(() => window.location.reload(), 3000);
        return `${data.code} has been deleted`;
      },
      error(error) {
        return error.message || error || "An unexpected error occurred";
      },
    });
  };

  const handleSortChange = (descriptor: SortDescriptor) => {
    const { column, direction } = descriptor;
    const valid = couponQuerySchema.safeParse({ column, direction });
    if (!valid.success) return;
    if (column && direction) {
      const params = new URLSearchParams(searchParams.toString());
      const query = createQueryString(
        [
          { name: "sortBy", value: column.toString() },
          { name: "direction", value: direction },
        ],
        params
      );
      setSortDescriptor(descriptor);
      router.replace("/admin/coupon?" + query);
    }
  };

  return {
    page,
    coupon,
    status,
    filterValue,
    sortDescriptor,
    rowsPerPage,
    selectedKeys,
    visibleColumns,
    headerColumns,
    loadingContent,
    isLoadingRefresh,
    isLoadingNew,
    isOpenDelete,
    setFilterValue,
    onSearchChange,
    onClickRefresh,
    onPressNew,
    onOpenChangeDelete,
    onCloseDelete,
    handleDelete,
    setSelectedKeys,
    setPage,
    onRowsPerPageChange,
    setVisibleColumns,
    renderCell,
    handleSortChange,
  };
};

export default DataTableHook;

const deleteQueryString = (entries: string[], params: URLSearchParams) => {
  entries.forEach(name => params.delete(name));
  return params.toString();
};

const createQueryString = (entries: { name: string; value: string }[], params: URLSearchParams) => {
  entries.forEach(({ name, value }) => params.set(name, value));
  return params.toString();
};
