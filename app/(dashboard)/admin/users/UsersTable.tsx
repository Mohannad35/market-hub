"use client";

import { Button } from "@nextui-org/button";
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@nextui-org/modal";
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@nextui-org/table";
import { Text } from "@radix-ui/themes";
import { useQuery } from "@tanstack/react-query";
import { ReadonlyURLSearchParams, useSearchParams } from "next/navigation";
import BottomContent from "./users-table-bottom-content";
import DataTableHook from "./users-table-hook";
import TopContent from "./users-table-top-content";
import { User } from "@prisma/client";
import { Input } from "@nextui-org/react";
import { useState } from "react";

export default function UsersTable() {
  const searchParams = useSearchParams();
  const { data: users, isSuccess, error, isLoading, refetch } = useUsers(searchParams);
  const [banReason, setBanReason] = useState("");
  const {
    page,
    delUser,
    banUser,
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
    setFilterValue,
    onSearchChange,
    onClickRefresh,
    onOpenChangeBan,
    onOpenChangeDelete,
    onCloseBan,
    onCloseDelete,
    handleBan,
    handleDelete,
    setSelectedKeys,
    setPage,
    onRowsPerPageChange,
    setVisibleColumns,
    renderCell,
    handleSortChange,
  } = DataTableHook(refetch);

  if (isLoading) return loadingContent;
  else if (error) return <p>Error: {error.message}</p>;
  else if (!isSuccess) return <p>Failed to load data</p>;

  const start = (page - 1) * rowsPerPage;
  const end = start + rowsPerPage;
  const pageItems = users.slice(start, end);

  return (
    <>
      <Table
        // isCompact
        // removeWrapper
        isHeaderSticky
        showSelectionCheckboxes
        selectionMode="multiple"
        bottomContentPlacement="outside"
        topContentPlacement="outside"
        checkboxesProps={{ color: "primary" }}
        classNames={{
          wrapper:
            "!max-h-[640px] !max-w-[calc(100vw-20rem)] bg-transparent p-0 rounded-none border-none shadow-none",
          loadingWrapper: "backdrop-blur-sm bg-background/30 z-10",
          th: ["bg-transparent", "text-default-500", "border-b", "border-divider"],
          thead: ["[&>tr]:first:rounded-none [&>tr]:first:shadow-none"],
          td: [
            // changing the rows border radius
            // first
            "group-data-[first=true]:first:before:rounded-none",
            "group-data-[first=true]:last:before:rounded-none",
            // middle
            "group-data-[middle=true]:before:rounded-none",
            // last
            "group-data-[last=true]:first:before:rounded-none",
            "group-data-[last=true]:last:before:rounded-none",
          ],
        }}
        aria-label="Order Table"
        selectedKeys={selectedKeys}
        sortDescriptor={sortDescriptor}
        bottomContent={
          <BottomContent
            users={users}
            isLoadingRefresh={isLoadingRefresh}
            page={page}
            rowsPerPage={rowsPerPage}
            selectedKeys={selectedKeys}
            setPage={setPage}
          />
        }
        topContent={
          <TopContent
            users={users}
            filterValue={filterValue}
            isLoadingRefresh={isLoadingRefresh}
            onClickRefresh={onClickRefresh}
            onRowsPerPageChange={onRowsPerPageChange}
            onSearchChange={onSearchChange}
            rowsPerPage={rowsPerPage}
            setFilterValue={setFilterValue}
            setVisibleColumns={setVisibleColumns}
            visibleColumns={visibleColumns}
          />
        }
        onSelectionChange={setSelectedKeys}
        onSortChange={handleSortChange}
      >
        <TableHeader columns={headerColumns}>
          {column => (
            <TableColumn
              key={column.value}
              align={column.align as "center" | "end" | "start"}
              allowsSorting={column.sortable}
              textValue={column.value}
            >
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody
          items={pageItems}
          isLoading={isLoadingRefresh}
          loadingContent={loadingContent}
          emptyContent={"No users found"}
        >
          {item => (
            <TableRow key={item.id}>
              {columnKey => {
                const { content, textValue } = renderCell(item, columnKey);
                return <TableCell textValue={textValue}>{content}</TableCell>;
              }}
            </TableRow>
          )}
        </TableBody>
      </Table>

      <Modal isOpen={isOpenDelete} onOpenChange={onOpenChangeDelete}>
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">Delete {delUser?.username}?</ModalHeader>
          <ModalBody>
            <Text>This Action can&apos;t be undone.</Text>
          </ModalBody>
          <ModalFooter>
            <Button color="default" variant="light" onPress={onCloseDelete}>
              Close
            </Button>
            <Button color="danger" onPress={handleDelete}>
              Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal isOpen={isOpenBan} onOpenChange={onOpenChangeBan}>
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">Ban {banUser?.username}?</ModalHeader>
          <ModalBody>
            <Text>
              The user will be banned from accessing the platform. Please provide a reason for the
              ban.
            </Text>
            <Input
              placeholder="Reason for ban"
              className="mt-2"
              value={banReason}
              onValueChange={setBanReason}
            />
          </ModalBody>
          <ModalFooter>
            <Button color="default" variant="light" onPress={onCloseBan}>
              Close
            </Button>
            <Button
              color="danger"
              isDisabled={banReason.length < 3}
              onPress={() => handleBan(banReason)}
            >
              Ban
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

const useUsers = (searchParams: ReadonlyURLSearchParams) => {
  const query = searchParams.toString();
  return useQuery<User[]>({
    queryKey: ["users"],
    queryFn: () => fetch(`/api/users${query ? `?${query}` : ""}`).then(res => res.json()),
    staleTime: 1000 * 60, // 1 minute
    retry: 3,
  });
};
