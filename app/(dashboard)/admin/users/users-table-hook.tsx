"use client";

import LoadingIndicator from "@/components/common/LoadingIndicator";
import { useMutationHook } from "@/hook/use-tanstack-hooks";
import {
  BanUserFormValues,
  DeleteUserFormValues,
  UnBanUserFormValues,
  usersQuerySchema,
} from "@/lib/validation/user-schema";
import { Icon as Iconify } from "@iconify/react";
import { Button } from "@nextui-org/button";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownSection,
  DropdownTrigger,
} from "@nextui-org/dropdown";
import { Chip, Link, User as NextUser } from "@nextui-org/react";
import { AvatarIcon } from "@nextui-org/shared-icons";
import { Selection, SortDescriptor } from "@nextui-org/table";
import { useDisclosure } from "@nextui-org/use-disclosure";
import { User } from "@prisma/client";
import { Text } from "@radix-ui/themes";
import { QueryObserverResult, RefetchOptions } from "@tanstack/react-query";
import { capitalize } from "lodash";
import moment from "moment";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { ChangeEvent, Key, useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { columns, INITIAL_VISIBLE_COLUMNS, roleOptions } from "./users-table-data";

const DataTableHook = (
  refetch: (options?: RefetchOptions) => Promise<QueryObserverResult<User[], Error>>
) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [delUser, setDelUser] = useState<User | undefined>(undefined);
  const [banUser, setBanUser] = useState<User | undefined>(undefined);
  const [unBanUser, setUnBanUser] = useState<User | undefined>(undefined);
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]));
  const [isLoadingRefresh, setIsLoadingRefresh] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState<Selection>(new Set(INITIAL_VISIBLE_COLUMNS));
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(1);
  const [filterValue, setFilterValue] = useState(() => {
    if (!searchParams.has("search")) return "";
    const valid = usersQuerySchema.safeParse({ search: searchParams.get("search") });
    if (!valid.success) return "";
    return valid.data.search;
  });
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>(() => {
    if (!searchParams.has("sortBy")) return { column: "createdAt", direction: "descending" };
    const valid = usersQuerySchema.safeParse({
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
  const {
    isOpen: isOpenBan,
    onOpen: onOpenBan,
    onOpenChange: onOpenChangeBan,
    onClose: onCloseBan,
  } = useDisclosure();
  const {
    isOpen: isOpenUnBan,
    onOpen: onOpenUnBan,
    onOpenChange: onOpenChangeUnBan,
    onClose: onCloseUnBan,
  } = useDisclosure();
  const delUserMutation = useMutationHook<User, DeleteUserFormValues>(
    `/api/user`,
    ["delUser"],
    "DELETE"
  );
  const banUserMutation = useMutationHook<User, BanUserFormValues>(
    `/api/user/ban`,
    ["banUser"],
    "DELETE"
  );
  const unBanUserMutation = useMutationHook<User, UnBanUserFormValues>(
    `/api/user/ban`,
    ["banUser"],
    "POST"
  );

  const onClickRefresh = useCallback(async () => {
    setIsLoadingRefresh(true);
    await refetch();
    setIsLoadingRefresh(false);
  }, [refetch]);

  useEffect(() => {
    onClickRefresh();
  }, [onClickRefresh, searchParams]);

  const onAction = (key: Key, user: User) => {
    switch (key) {
      case "ban":
        setBanUser(user);
        onOpenBan();
        break;
      case "unBan":
        setUnBanUser(user);
        onOpenUnBan();
        break;
      case "delete":
        setDelUser(user);
        onOpenDelete();
        break;
      default:
        break;
    }
  };

  const renderCell = (user: User, columnKey: Key): { content: JSX.Element; textValue: string } => {
    const {
      name,
      email,
      image,
      avatar,
      isVerified,
      role,
      username,
      gender,
      phoneNumber,
      birthday,
      address,
      businessAddress,
      websiteAddress,
      isBanned,
      createdAt,
    } = user;
    const cellValue = user[columnKey as keyof User];
    switch (columnKey) {
      case "username":
        return {
          content: (
            <Text weight="medium" wrap="nowrap" className="font-fira_code font-medium">
              {username}
            </Text>
          ),
          textValue: String(username),
        };
      case "address":
        return {
          content: (
            <Text truncate wrap="nowrap" className="max-w-[400px]">
              {address ? address : "N/A"}
            </Text>
          ),
          textValue: String(address ? address : "N/A"),
        };
      case "gender":
        return {
          content: (
            <Text weight="medium" wrap="nowrap">
              {gender ? capitalize(gender) : "N/A"}
            </Text>
          ),
          textValue: String(gender ? capitalize(gender) : "N/A"),
        };
      case "user":
        return {
          content: (
            <NextUser
              name={name}
              description={email}
              classNames={{ name: "flex-nowrap text-nowrap whitespace-nowrap" }}
              avatarProps={{
                size: "sm",
                radius: "full",
                showFallback: true,
                fallback: <AvatarIcon fontSize={24} />,
                ImgComponent: Image,
                imgProps: { width: 48, height: 48 },
                alt: `${name} avatar image`,
                src: image?.secure_url || avatar || undefined,
              }}
            />
          ),
          textValue: String(name),
        };
      case "verified":
        return {
          content: (
            <Text weight="medium" wrap="nowrap">
              <Chip
                variant="flat"
                color={isVerified ? "success" : "danger"}
                className="font-fira_code font-medium"
                startContent={
                  <Iconify
                    icon={
                      isVerified
                        ? "solar:check-circle-bold-duotone"
                        : "solar:close-circle-bold-duotone"
                    }
                    fontSize={22}
                  />
                }
              >
                {isVerified ? "Verified" : "Not Verified"}
              </Chip>
            </Text>
          ),
          textValue: String(isVerified ? "Verified" : "Not Verified"),
        };
      case "role":
        return {
          content: (
            <Text weight="medium" wrap="nowrap">
              <Chip
                variant="flat"
                color={roleOptions[role].color}
                className="font-fira_code font-medium"
                startContent={<Iconify icon={roleOptions[role].icon} fontSize={22} />}
              >
                {capitalize(role)}
              </Chip>
            </Text>
          ),
          textValue: String(capitalize(role)),
        };
      case "birthday":
        return {
          content: (
            <Text weight="medium" wrap="nowrap" className="font-fira_code">
              {birthday ? <span>{moment(birthday).format("MMM, DD YYYY")}</span> : "N/A"}
            </Text>
          ),
          textValue: String(birthday ? moment(birthday).format("MMM, DD YYYY") : "N/A"),
        };
      case "phone":
        return {
          content: (
            <Text truncate wrap="nowrap" className="max-w-[400px] font-fira_code font-medium">
              {phoneNumber
                ? `(+${phoneNumber.countryCallingCode})${phoneNumber.nationalNumber}`
                : "N/A"}
            </Text>
          ),
          textValue: String(phoneNumber ? phoneNumber.number : "N/A"),
        };
      case "businessAddress":
        return {
          content: (
            <Text truncate wrap="nowrap" className="max-w-[400px]">
              {businessAddress ? businessAddress : "N/A"}
            </Text>
          ),
          textValue: String(businessAddress ? businessAddress : "N/A"),
        };
      case "websiteAddress":
        return {
          content: (
            <Text truncate wrap="nowrap" className="max-w-[400px] font-fira_code font-medium">
              {websiteAddress ? (
                <Link href={websiteAddress} underline="hover">
                  {websiteAddress}
                </Link>
              ) : (
                "N/A"
              )}
            </Text>
          ),
          textValue: capitalize(websiteAddress ? websiteAddress : "N/A"),
        };
      case "banned":
        return {
          content: (
            <Text weight="medium" wrap="nowrap">
              <Chip
                variant="flat"
                color={isBanned ? "danger" : "default"}
                className="font-fira_code font-medium"
                startContent={
                  <Iconify
                    icon={
                      isBanned ? "solar:sad-circle-bold-duotone" : "solar:smile-circle-bold-duotone"
                    }
                    fontSize={22}
                  />
                }
              >
                {isBanned ? "Banned" : "Not Banned"}
              </Chip>
            </Text>
          ),
          textValue: String(isBanned ? "Banned" : "Not Banned"),
        };
      case "createdAt":
        return {
          content: (
            <Text weight="medium" wrap="nowrap" className="font-fira_code font-medium">
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
                <DropdownMenu onAction={key => onAction(key, user)} variant="faded">
                  <DropdownSection title="Actions" classNames={{ heading: "text-base" }}>
                    {user.isBanned ? (
                      <DropdownItem
                        key="unBan"
                        color="danger"
                        description="Un ban the user"
                        startContent={
                          <Iconify icon="solar:user-check-bold-duotone" fontSize={32} />
                        }
                        classNames={{ title: "text-base font-medium", description: "font-medium" }}
                        className="text-danger"
                      >
                        Un Ban
                      </DropdownItem>
                    ) : (
                      <DropdownItem
                        key="ban"
                        color="danger"
                        description="Ban the user"
                        startContent={
                          <Iconify icon="solar:user-block-bold-duotone" fontSize={32} />
                        }
                        classNames={{ title: "text-base font-medium", description: "font-medium" }}
                        className="text-danger"
                      >
                        Ban
                      </DropdownItem>
                    )}
                    <DropdownItem
                      key="delete"
                      color="danger"
                      description="Permanently delete the user"
                      startContent={<Iconify icon="solar:user-minus-bold-duotone" fontSize={32} />}
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
      return router.replace("/admin/users" + (query && query.length > 0) ? "?" + query : "");
    } else if (value) {
      setFilterValue(value);
      setPage(1);
      const query = createQueryString([{ name: "search", value }], params);
      return router.replace("/admin/users?" + query);
    }
  };

  const headerColumns =
    visibleColumns === "all"
      ? columns
      : columns.filter(column => Array.from(visibleColumns).includes(column.value));

  const loadingContent = <LoadingIndicator />;

  const handleDelete = async (reason: string, uponRequest: boolean) => {
    if (!delUser) return;
    onCloseDelete();
    const promise = new Promise<User>(async (resolve, reject) =>
      delUserMutation
        .mutateAsync({ username: delUser.username, reason, uponRequest })
        .then(resolve)
        .catch(reject)
    );
    toast.promise(promise, {
      loading: "Deleting user...",
      success(data) {
        setTimeout(() => window.location.reload(), 3000);
        return `${data.username} has been deleted`;
      },
      error(error) {
        return error.message || error || "An unexpected error occurred";
      },
    });
  };

  const handleBan = async (reason: string) => {
    if (!banUser) return;
    onCloseBan();
    const promise = new Promise<User>(async (resolve, reject) =>
      banUserMutation
        .mutateAsync({ username: banUser.username, reason })
        .then(resolve)
        .catch(reject)
    );
    toast.promise(promise, {
      loading: "Banning user...",
      success(data) {
        setTimeout(() => window.location.reload(), 3000);
        return `${data.username} has been banned`;
      },
      error(error) {
        return error.message || error || "An unexpected error occurred";
      },
    });
  };

  const handleUnBan = async () => {
    if (!unBanUser) return;
    onCloseUnBan();
    const promise = new Promise<User>(async (resolve, reject) =>
      unBanUserMutation.mutateAsync({ username: unBanUser.username }).then(resolve).catch(reject)
    );
    toast.promise(promise, {
      loading: "Unbanning user...",
      success(data) {
        setTimeout(() => window.location.reload(), 3000);
        return `${data.username} has been unbanned`;
      },
      error(error) {
        return error.message || error || "An unexpected error occurred";
      },
    });
  };

  const handleSortChange = (descriptor: SortDescriptor) => {
    const { column, direction } = descriptor;
    const valid = usersQuerySchema.safeParse({ sortBy: column, direction });
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
      router.replace("/admin/users?" + query);
    }
  };

  return {
    page,
    delUser,
    banUser,
    unBanUser,
    filterValue,
    sortDescriptor,
    rowsPerPage,
    selectedKeys,
    visibleColumns,
    headerColumns,
    loadingContent,
    isLoadingRefresh,
    isOpenBan,
    isOpenDelete,
    isOpenUnBan,
    onOpenUnBan,
    onOpenChangeUnBan,
    onCloseUnBan,
    setFilterValue,
    onSearchChange,
    onClickRefresh,
    onOpenChangeBan,
    onOpenChangeDelete,
    onCloseBan,
    onCloseDelete,
    handleBan,
    handleUnBan,
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
