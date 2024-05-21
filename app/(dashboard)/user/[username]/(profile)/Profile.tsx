"use client";

import LoadingIndicator from "@/components/common/LoadingIndicator";
import { getProfile } from "@/lib/query-functions/user";
import { fromDate, getLocalTimeZone, toCalendarDate } from "@internationalized/date";
import { Button, Chip, Divider, Link } from "@nextui-org/react";
import { User } from "@prisma/client";
import { Flex, Text } from "@radix-ui/themes";
import { useQuery } from "@tanstack/react-query";
import { capitalize } from "lodash";
import { CheckIcon, XIcon } from "lucide-react";
import moment from "moment";
import NextLink from "next/link";
import { FaCircleCheck, FaCircleXmark } from "react-icons/fa6";
import ProfileImage from "./ProfileImage";
import Snippet from "./Snippet";
import { useSession } from "next-auth/react";
import { useMutationHook, useQueryHook } from "@/hook/use-tanstack-hooks";
import { UserWithToken } from "@/lib/types";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { nanoid } from "nanoid";
import { notFound, usePathname } from "next/navigation";

const roles = {
  admin: { name: "Admin", className: "bg-[#7469B6] shadow-[#7469B6]/50", Icon: FaCircleCheck },
  support: { name: "Support", className: "bg-[#f5a524] shadow-[#f5a524]/50", Icon: FaCircleCheck },
  vendor: { name: "Vendor", className: "bg-[#17c964] shadow-[#17c964]/50", Icon: FaCircleCheck },
  user: { name: "User", className: "bg-[#17c964] shadow-[#17c964]/50", Icon: FaCircleCheck },
};

const Profile = ({ username }: { username: string }) => {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const { data, error, isSuccess, isLoading } = useQuery<User>({
    queryKey: ["getProfile", username],
    queryFn: getProfile,
  });
  const resendVerification = useMutationHook<UserWithToken, undefined>(
    `/api/resend-verification`,
    ["resendVerification", username],
    "GET"
  );

  async function handleResendVerification() {
    const promise = new Promise<UserWithToken>((resolve, reject) =>
      resendVerification.mutateAsync(undefined).then(resolve).catch(reject)
    );
    toast.promise(promise, {
      loading: "Resending verification email...",
      success: data => "Verification email sent successfully",
      error: err => err || "An unexpected error occurred",
      id: "resend-toast" + nanoid(4),
    });
  }

  if (isLoading || status === "loading") return <LoadingIndicator />;
  else if (error) {
    if (error.message === "Not Found") notFound();
    return <div className="container">Error: {error.message}</div>;
  } else if (!isSuccess || !data) return <div className="container">No data</div>;
  const {
    name,
    image,
    avatar,
    email,
    isVerified,
    role,
    phoneNumber,
    birthday,
    gender,
    address,
    businessAddress,
    websiteAddress,
  } = data;
  const { name: roleName, Icon, className } = roles[role];
  return (
    <Flex direction="column" gapY="2">
      <Flex justify="between">
        <ProfileImage src={image ? image.secure_url : avatar ?? undefined} name={name} />

        {status === "authenticated" && session.user.username === username && (
          <Button
            variant="faded"
            color="default"
            size="sm"
            radius="lg"
            as={NextLink}
            href={`${pathname}/edit`}
          >
            <Text size="4" weight="medium">
              Edit Profile
            </Text>
          </Button>
        )}
      </Flex>
      <Flex direction="row" justify="between">
        <Text size="6" weight="bold">
          {name}
        </Text>
        <Flex direction="row" gapX="2">
          {role !== "user" && (
            <Chip
              startContent={<Icon size={18} className="text-white dark:text-black" />}
              variant="shadow"
              className={className}
              classNames={{ content: "text-white dark:text-black" }}
            >
              <Text size="3" weight="medium">
                {roleName}
              </Text>
            </Chip>
          )}
        </Flex>
      </Flex>

      {email && (
        <>
          <Divider className="my-2" />
          <Flex direction="row" justify="between">
            <Flex gap="2" align="center">
              <Snippet className="bg-transparent" text="Email" />
              <Snippet text={email} />
            </Flex>
            <Flex gap="2" justify="end" align="center">
              {status === "authenticated" && session.user.username === username && !isVerified && (
                <Button
                  variant="faded"
                  color="default"
                  size="sm"
                  radius="full"
                  onClick={() => handleResendVerification()}
                  isLoading={resendVerification.isPending}
                >
                  <Text size="3" weight="medium">
                    Resend Verification
                  </Text>
                </Button>
              )}
              <Chip
                startContent={isVerified ? <CheckIcon size={18} /> : <XIcon size={18} />}
                variant="faded"
                color={isVerified ? "success" : "danger"}
              >
                {isVerified ? "Verified" : "Not Verified"}
              </Chip>
            </Flex>
          </Flex>
        </>
      )}

      {phoneNumber && (
        <>
          <Divider className="my-2" />
          <Flex gap="2" align="center">
            <Snippet className="bg-transparent" text="Phone" />
            <Snippet>
              (+{phoneNumber.countryCallingCode}) {phoneNumber.nationalNumber}
            </Snippet>
          </Flex>
        </>
      )}

      {(gender || birthday) && <Divider className="my-2" />}
      <Flex direction={{ initial: "column", xs: "row" }} width="100%">
        {gender && (
          <Text size="4" weight="medium" className="w-1/2">
            <Snippet className="bg-transparent" text="Gender" />
            <Snippet text={capitalize(gender)} />
          </Text>
        )}

        {birthday && (
          <Flex className="w-1/2" gap="2" justify="start" align="center">
            <Snippet className="bg-transparent" text="Birthday" />
            <Snippet>
              {moment(
                toCalendarDate(fromDate(new Date(birthday), getLocalTimeZone())).toString()
              ).format("DD MMMM YYYY")}
            </Snippet>
          </Flex>
        )}
      </Flex>

      {address && (
        <>
          <Divider className="my-2" />
          <Flex direction="row" gap="2" align="center">
            <Snippet className="bg-transparent" text="Address" />
            <Snippet text={address} />
          </Flex>
        </>
      )}

      {websiteAddress && (
        <>
          <Divider className="my-2" />
          <Flex direction="row" gap="2" align="center">
            <Snippet className="bg-transparent" text="Website Address" />
            <Snippet>
              <Link as={NextLink} href={websiteAddress}>
                {websiteAddress}
              </Link>
            </Snippet>
          </Flex>
        </>
      )}

      {businessAddress && (
        <>
          <Divider className="my-2" />
          <Flex direction="row" gap="2" align="center">
            <Snippet className="bg-transparent" text="Business Address" />
            <Snippet text={businessAddress} />
          </Flex>
        </>
      )}
    </Flex>
  );
};

export default Profile;
