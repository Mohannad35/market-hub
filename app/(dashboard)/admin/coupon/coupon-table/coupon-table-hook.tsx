"use client";

import LoadingIndicator from "@/components/common/LoadingIndicator";
import { useMutationHook } from "@/hook/use-tanstack-hooks";
import { CouponWithUser } from "@/lib/types";
import { couponQuerySchema } from "@/lib/validation/coupon-schema";
import { Icon as Iconify } from "@iconify/react";
import { Button } from "@nextui-org/button";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownSection,
  DropdownTrigger,
} from "@nextui-org/dropdown";
import { Link } from "@nextui-org/link";
import { Chip, User } from "@nextui-org/react";
import { AvatarIcon } from "@nextui-org/shared-icons";
import { Selection, SortDescriptor } from "@nextui-org/table";
import { useDisclosure } from "@nextui-org/use-disclosure";
import { Coupon } from "@prisma/client";
import { Text } from "@radix-ui/themes";
import { QueryObserverResult, RefetchOptions } from "@tanstack/react-query";
import { capitalize } from "lodash";
import moment from "moment";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { ChangeEvent, Key, useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { columns, INITIAL_VISIBLE_COLUMNS, typeOptions } from "./coupon-table-data";

const DataTableHook = (
  refetch: (options?: RefetchOptions) => Promise<QueryObserverResult<Coupon[], Error>>
) => {
  const router = useRouter();
  const searchParams = useSearchParams();
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
            <Link href={`/coupon/${coupon.code}`} color="primary" underline="hover">
              <Text truncate weight="medium" wrap="nowrap" className="max-w-[300px]">
                {code}
              </Text>
            </Link>
          ),
          textValue: String(code),
        };
      case "value":
        return {
          content: (
            <Text weight="medium" wrap="nowrap" className="font-fira_code">
              {value.toString()}
            </Text>
          ),
          textValue: String(value),
        };
      case "type":
        return {
          content: (
            <Text weight="medium" wrap="nowrap">
              <Chip
                variant="flat"
                color={typeOptions[type].color}
                className="font-fira_code font-medium"
                startContent={<Iconify icon={typeOptions[type].icon} fontSize={22} />}
              >
                {capitalize(type)}
              </Chip>
            </Text>
          ),
          textValue: String(capitalize(type)),
        };
      case "user":
        return {
          content: (
            <User
              name={user.name}
              avatarProps={{
                size: "sm",
                radius: "full",
                showFallback: true,
                fallback: <AvatarIcon fontSize={24} />,
                ImgComponent: Image,
                imgProps: { width: 48, height: 48 },
                alt: `${user.name} avatar image`,
                src: user.image?.secure_url || user.avatar || undefined,
              }}
              classNames={{ name: "flex-nowrap text-nowrap whitespace-nowrap" }}
              description={capitalize(user.role)}
            />
          ),
          textValue: String(user.name),
        };
      case "minAmount":
        return {
          content: (
            <Text weight="medium" wrap="nowrap" className="font-fira_code">
              {minAmount.toString()}
            </Text>
          ),
          textValue: String(minAmount),
        };
      case "maxAmount":
        return {
          content: (
            <Text weight="medium" wrap="nowrap" className="font-fira_code">
              {maxAmount ? maxAmount.toString() : "N/A"}
            </Text>
          ),
          textValue: String(maxAmount),
        };
      case "name":
        return {
          content: (
            <Text truncate wrap="nowrap" className="max-w-[300px]">
              {name ? name : "N/A"}
            </Text>
          ),
          textValue: String(name),
        };
      case "description":
        return {
          content: (
            <Text truncate wrap="nowrap" className="max-w-[400px]">
              {description ? description : "N/A"}
            </Text>
          ),
          textValue: String(description),
        };
      case "startDate":
        return {
          content: (
            <Text weight="medium" wrap="nowrap" className="font-fira_code">
              <span>{moment(startDate).format("MMM, DD YYYY")}</span>
            </Text>
          ),
          textValue: moment(startDate).format("MMM, DD YYYY"),
        };
      case "endDate":
        return {
          content: (
            <Text weight="medium" wrap="nowrap" className="font-fira_code">
              <span>{moment(endDate).format("MMM, DD YYYY")}</span>
            </Text>
          ),
          textValue: moment(endDate).format("MMM, DD YYYY"),
        };
      case "createdAt":
        return {
          content: (
            <Text weight="medium" wrap="nowrap" className="font-fira_code">
              <span>{moment(createdAt).format("MMM, DD YYYY")}</span>
            </Text>
          ),
          textValue: moment(createdAt).format("MMM, DD YYYY"),
        };
      case "actions":
        return {
          content: (
            <div className="flex justify-end">
              <Dropdown
                classNames={{
                  base: "before:bg-default-200", // change arrow background
                  content:
                    "p-1 border border-default-200 bg-gradient-to-br from-white to-default-200 dark:from-default-50 dark:to-black font-fira_code",
                }}
              >
                <DropdownTrigger>
                  <Button isIconOnly radius="full" size="sm" variant="light">
                    <Iconify icon="solar:menu-dots-bold-duotone" fontSize={22} />
                  </Button>
                </DropdownTrigger>
                <DropdownMenu onAction={key => onAction(key, coupon)} variant="faded">
                  <DropdownSection title="Actions" classNames={{ heading: "text-base" }}>
                    <DropdownItem
                      key="view"
                      color="default"
                      description="View the coupon"
                      startContent={<Iconify icon="mdi:coupon" fontSize={32} />}
                      classNames={{ title: "text-base font-medium", description: "font-medium" }}
                    >
                      View
                    </DropdownItem>
                    <DropdownItem
                      key="edit"
                      color="default"
                      description="Edit the coupon"
                      startContent={
                        <Iconify icon="solar:pen-new-square-bold-duotone" fontSize={32} />
                      }
                      classNames={{ title: "text-base font-medium", description: "font-medium" }}
                    >
                      Edit
                    </DropdownItem>
                    <DropdownItem
                      key="delete"
                      color="danger"
                      description="Permanently delete the order"
                      startContent={
                        <Iconify icon="solar:trash-bin-trash-bold-duotone" fontSize={32} />
                      }
                      classNames={{ title: "text-base font-medium", description: "font-medium" }}
                      className="text-danger"
                    >
                      Delete
                    </DropdownItem>
                  </DropdownSection>
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

  const loadingContent = <LoadingIndicator />;

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
