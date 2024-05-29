"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { useMutationHook } from "@/hook/use-tanstack-hooks";
import { OrderIncluded } from "@/lib/types";
import { orderQuerySchema } from "@/lib/validation/order-schema";
import { Button } from "@nextui-org/button";
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@nextui-org/dropdown";
import { Link } from "@nextui-org/link";
import { User } from "@nextui-org/react";
import { AvatarIcon } from "@nextui-org/shared-icons";
import { Selection, SortDescriptor } from "@nextui-org/table";
import { useDisclosure } from "@nextui-org/use-disclosure";
import { Order } from "@prisma/client";
import { Flex, Text } from "@radix-ui/themes";
import { QueryObserverResult, RefetchOptions } from "@tanstack/react-query";
import { capitalize } from "lodash";
import moment from "moment";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { ChangeEvent, Key, useCallback, useEffect, useState } from "react";
import { HiDotsHorizontal } from "react-icons/hi";
import { toast } from "sonner";
import { columns } from "./order-table-data";

const INITIAL_VISIBLE_COLUMNS = ["code", "user", "bill", "status", "actions"];

const DataTableHook = (
  refetch: (options?: RefetchOptions) => Promise<QueryObserverResult<OrderIncluded[], Error>>
) => {
  const router = useRouter();
  const { status } = useSession();
  const searchParams = useSearchParams();
  const [order, setOrder] = useState<Order | undefined>(undefined);
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]));
  const [isLoadingRefresh, setIsLoadingRefresh] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState<Selection>(new Set(INITIAL_VISIBLE_COLUMNS));
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(1);
  const [filterValue, setFilterValue] = useState(() => {
    if (!searchParams.has("search")) return "";
    const valid = orderQuerySchema.safeParse({ search: searchParams.get("search") });
    if (!valid.success) return "";
    return valid.data.search;
  });
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>(() => {
    if (!searchParams.has("sortBy")) return { column: "createdAt", direction: "descending" };
    const valid = orderQuerySchema.safeParse({
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
  const delOrderMutation = useMutationHook<Order, { code: string }>(
    `/api/order`,
    ["delOrder"],
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

  const onAction = (key: Key, order: Order) => {
    switch (key) {
      case "view":
        router.push(`/admin/orders/${order.code}`);
        break;
      case "edit":
        router.push(`/admin/orders/${order.code}/edit`);
        break;
      case "delete":
        setOrder(order);
        onOpenDelete();
        break;
      default:
        break;
    }
  };

  const renderCell = (
    order: OrderIncluded,
    columnKey: Key
  ): { content: JSX.Element; textValue: string } => {
    const {
      code,
      address,
      phone,
      email,
      payment,
      bill,
      discount,
      status,
      coupon,
      createdAt,
      user,
    } = order;
    const cellValue = order[columnKey as keyof OrderIncluded];
    switch (columnKey) {
      case "code":
        return {
          content: (
            <Flex>
              <Link href={`/admin/orders/${order.code}`} color="primary" underline="hover">
                <Text truncate weight="medium" wrap="nowrap" className="max-w-[300px]">
                  {code}
                </Text>
              </Link>
            </Flex>
          ),
          textValue: String(code),
        };
      case "address":
        return {
          content: (
            <Flex>
              <Text truncate wrap="nowrap" className="max-w-[400px]">
                {address}
              </Text>
            </Flex>
          ),
          textValue: String(address),
        };
      case "bill":
        return {
          content: (
            <Flex>
              <Text weight="medium" wrap="nowrap">
                {bill.toString()}
              </Text>
            </Flex>
          ),
          textValue: String(bill.toString()),
        };
      case "user":
        return {
          content: (
            <Flex>
              <User
                name={user.name}
                description={user.email}
                classNames={{ name: "flex-nowrap text-nowrap whitespace-nowrap" }}
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
              />
            </Flex>
          ),
          textValue: String(user.name),
        };
      case "coupon":
        return {
          content: (
            <Flex>
              <Text weight="medium" wrap="nowrap">
                {coupon.code}
              </Text>
            </Flex>
          ),
          textValue: String(coupon.code),
        };
      case "discount":
        return {
          content: (
            <Flex>
              <Text weight="medium" wrap="nowrap">
                {discount && discount > 0 ? discount.toString() : "N/A"}
              </Text>
            </Flex>
          ),
          textValue: String(discount.toString()),
        };
      case "email":
        return {
          content: (
            <Flex>
              <Text truncate wrap="nowrap" className="max-w-[300px]">
                {email}
              </Text>
            </Flex>
          ),
          textValue: String(email),
        };
      case "phone":
        return {
          content: (
            <Flex>
              <Text truncate wrap="nowrap" className="max-w-[400px]">
                {`(+${phone.countryCallingCode})${phone.nationalNumber}`}
              </Text>
            </Flex>
          ),
          textValue: String(phone.number),
        };
      case "payment":
        return {
          content: (
            <Text weight="medium" wrap="nowrap">
              {payment === "cod" ? "Cash on Delivery" : capitalize(payment)}
            </Text>
          ),
          textValue: String(payment === "cod" ? "Cash on Delivery" : capitalize(payment)),
        };
      case "status":
        return {
          content: (
            <Text weight="medium" wrap="nowrap">
              {capitalize(status)}
            </Text>
          ),
          textValue: capitalize(status),
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
                <DropdownMenu items={actions} onAction={key => onAction(key, order)}>
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
      return router.replace("/admin/orders" + (query && query.length > 0) ? "?" + query : "");
    } else if (value) {
      setFilterValue(value);
      setPage(1);
      const query = createQueryString([{ name: "search", value }], params);
      return router.replace("/admin/orders?" + query);
    }
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
    if (!order) return;
    onCloseDelete();
    const promise = new Promise<Order>(async (resolve, reject) =>
      delOrderMutation.mutateAsync({ code: order.code }).then(resolve).catch(reject)
    );
    toast.promise(promise, {
      loading: "Deleting order...",
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
    const valid = orderQuerySchema.safeParse({ column, direction });
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
      router.replace("/admin/orders?" + query);
    }
  };

  return {
    page,
    order,
    filterValue,
    sortDescriptor,
    rowsPerPage,
    selectedKeys,
    visibleColumns,
    headerColumns,
    loadingContent,
    isLoadingRefresh,
    isOpenDelete,
    setFilterValue,
    onSearchChange,
    onClickRefresh,
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
