"use client";

import { CouponWithUser } from "@/lib/types";
import { Button } from "@nextui-org/button";
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@nextui-org/modal";
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@nextui-org/table";
import { Text } from "@radix-ui/themes";
import { useQuery } from "@tanstack/react-query";
import { ReadonlyURLSearchParams, useSearchParams } from "next/navigation";
import DataTableHook from "./coupon-table-hook";
import BottomContent from "./data-table-bottom-content";
import TopContent from "./data-table-top-content";

export default function CouponTable() {
  const searchParams = useSearchParams();
  const { data: coupons, isSuccess, error, isLoading, refetch } = useCoupons(searchParams);
  const {
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
  } = DataTableHook(refetch);

  if (isLoading) return loadingContent;
  else if (error) return <p>Error: {error.message}</p>;
  else if (isSuccess) {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    const pageItems = coupons.slice(start, end);

    return (
      <>
        <Table
          isHeaderSticky
          showSelectionCheckboxes
          selectionMode="multiple"
          bottomContentPlacement="outside"
          topContentPlacement="outside"
          checkboxesProps={{ color: "primary" }}
          classNames={{ wrapper: "max-h-[640px] max-w-[calc(100vw-20rem)]" }}
          aria-label="Coupon Table"
          selectedKeys={selectedKeys}
          sortDescriptor={sortDescriptor}
          bottomContent={
            <BottomContent
              coupons={coupons}
              isLoadingRefresh={isLoadingRefresh}
              page={page}
              rowsPerPage={rowsPerPage}
              selectedKeys={selectedKeys}
              setPage={setPage}
            />
          }
          topContent={
            <TopContent
              coupons={coupons}
              filterValue={filterValue}
              isLoadingNew={isLoadingNew}
              isLoadingRefresh={isLoadingRefresh}
              onClickRefresh={onClickRefresh}
              onPressNew={onPressNew}
              onRowsPerPageChange={onRowsPerPageChange}
              onSearchChange={onSearchChange}
              rowsPerPage={rowsPerPage}
              setFilterValue={setFilterValue}
              setVisibleColumns={setVisibleColumns}
              visibleColumns={visibleColumns}
              status={status}
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
            emptyContent={"No issues found"}
          >
            {item => {
              return (
                <TableRow key={item.id}>
                  {columnKey => {
                    const { content, textValue } = renderCell(item, columnKey);
                    return <TableCell textValue={textValue}>{content}</TableCell>;
                  }}
                </TableRow>
              );
            }}
          </TableBody>
        </Table>

        <Modal isOpen={isOpenDelete} onOpenChange={onOpenChangeDelete}>
          <ModalContent>
            <ModalHeader className="flex flex-col gap-1">Delete {coupon?.code}?</ModalHeader>
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
      </>
    );
  }
}

const useCoupons = (searchParams: ReadonlyURLSearchParams) => {
  const query = searchParams.toString();
  return useQuery<CouponWithUser[]>({
    queryKey: ["coupons"],
    queryFn: () => fetch(`/api/coupon${query ? `?${query}` : ""}`).then(res => res.json()),
    staleTime: 1000 * 60, // 1 minute
    retry: 3,
  });
};
