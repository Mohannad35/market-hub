"use client";

import LoadingIndicator from "@/components/common/LoadingIndicator";
import { getCoupon } from "@/lib/query-functions/coupon";
import { CouponWithUser } from "@/lib/types";
import {
  Card,
  CardBody,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  User,
} from "@nextui-org/react";
import { AvatarIcon } from "@nextui-org/shared-icons";
import { Coupon } from "@prisma/client";
import { Flex, Text } from "@radix-ui/themes";
import { useQuery } from "@tanstack/react-query";
import { capitalize } from "lodash";
import moment from "moment";
import Image from "next/image";
import React from "react";

const CouponDetails = ({ code }: { code: string }) => {
  const {
    data: coupon,
    error,
    isSuccess,
    isLoading,
  } = useQuery<CouponWithUser>({
    queryKey: ["getCoupon", code],
    queryFn: getCoupon,
  });

  if (isLoading) return <LoadingIndicator />;
  if (error) return <Text>Error: {error.message}</Text>;
  if (!isSuccess || !coupon) return <Text size="6">Coupon not found</Text>;

  return (
    <Table hideHeader aria-label="" className="font-fira_code">
      <TableHeader>
        <TableColumn>PROPERTY</TableColumn>
        <TableColumn>VALUE</TableColumn>
      </TableHeader>
      <TableBody>
        <TableRow key="code">
          <TableCell width={200}>Code</TableCell>
          <TableCell>
            <Flex width="100%" justify="between">
              <Text size="6" weight="medium">
                {coupon.code}
              </Text>
              <Text size="5" weight="medium">
                {coupon.value} %
              </Text>
            </Flex>
          </TableCell>
        </TableRow>

        <TableRow key="user">
          <TableCell>Owner</TableCell>
          <TableCell>
            <User
              name={coupon.user.name}
              avatarProps={{
                radius: "full",
                size: "sm",
                src: coupon.user.image?.secure_url || coupon.user.avatar || undefined,
                showFallback: true,
                fallback: <AvatarIcon fontSize={24} />,
                ImgComponent: Image,
                imgProps: { width: 48, height: 48 },
                alt: `${coupon.user.name} avatar image`,
              }}
              classNames={{ name: "flex-nowrap text-nowrap whitespace-nowrap" }}
              description={capitalize(coupon.user.role)}
            />
          </TableCell>
        </TableRow>

        <TableRow key="type">
          <TableCell>Type</TableCell>
          <TableCell>
            <Text size="4" weight="medium" wrap="nowrap">
              {capitalize(coupon.type)}
            </Text>
          </TableCell>
        </TableRow>

        <TableRow key="startDate">
          <TableCell>Start Date</TableCell>
          <TableCell>
            <Text size="4" weight="medium" wrap="nowrap">
              <span>{moment(coupon.startDate).format("MMM, DD YYYY")}</span>
            </Text>
          </TableCell>
        </TableRow>

        <TableRow key="endDate">
          <TableCell>End Date</TableCell>
          <TableCell>
            <Text size="4" weight="medium" wrap="nowrap">
              <span>{moment(coupon.endDate).format("MMM, DD YYYY")}</span>
            </Text>
          </TableCell>
        </TableRow>

        <TableRow key="minAmount">
          <TableCell>Min Amount</TableCell>
          <TableCell>
            <Text size="4" weight="medium" wrap="nowrap">
              {coupon.minAmount.toString()}
            </Text>
          </TableCell>
        </TableRow>

        <TableRow key="maxAmount">
          <TableCell>Max Amount</TableCell>
          <TableCell>
            <Text size="4" weight="medium" wrap="nowrap">
              {coupon.maxAmount ? coupon.maxAmount.toString() : "N/A"}
            </Text>
          </TableCell>
        </TableRow>

        <TableRow key="name">
          <TableCell>Name</TableCell>
          <TableCell>
            <Text size="4" weight="medium">
              {coupon.name ? coupon.name : "N/A"}
            </Text>
          </TableCell>
        </TableRow>

        <TableRow key="description">
          <TableCell>Description</TableCell>
          <TableCell>
            <Text size="4" weight="medium">
              {coupon.description ? coupon.description : "N/A"}
            </Text>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
};

export default CouponDetails;
