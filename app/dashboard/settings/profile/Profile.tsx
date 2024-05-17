"use client";

import LoadingIndicator from "@/components/common/LoadingIndicator";
import { getProfile } from "@/lib/query-functions/user";
import { Button, Chip, Code, Divider, Link, user } from "@nextui-org/react";
import { User } from "@prisma/client";
import { Flex, Text } from "@radix-ui/themes";
import { useQuery } from "@tanstack/react-query";
import { CheckIcon, XIcon } from "lucide-react";
import { FaCircleCheck, FaCircleXmark } from "react-icons/fa6";
import ProfileImage from "./ProfileImage";
import { capitalize } from "lodash";
import { fromDate, getLocalTimeZone, toCalendarDate } from "@internationalized/date";
import moment from "moment";
import Snippet from "./Snippet";
import NextLink from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useSession } from "next-auth/react";

const roles = [
  { name: "Admin", key: "isAdmin", cn: "bg-[#7469B6] shadow-[#7469B6]/50", Icon: FaCircleCheck },
  {
    name: "Support",
    key: "isSupport",
    cn: "bg-[#f5a524] shadow-[#f5a524]/50",
    Icon: FaCircleCheck,
  },
  { name: "Vendor", key: "isVendor", cn: "bg-[#17c964] shadow-[#17c964]/50", Icon: FaCircleCheck },
  { name: "Banned", key: "isBanned", cn: "bg-[#f31260] shadow-[#f31260]/50", Icon: FaCircleXmark },
];

const Profile = () => {
  const { status, data: da, update } = useSession();
  const { data, error, isSuccess, isLoading, refetch } = useQuery<User>({
    queryKey: ["getProfile"],
    queryFn: getProfile,
  });

  if (isLoading) return <LoadingIndicator />;
  else if (error) return <div className="container">Error: {error.message}</div>;
  else if (!isSuccess || !data) return <div className="container">No data</div>;
  const {
    name,
    image,
    avatar,
    email,
    isVerified,
    phoneNumber,
    birthday,
    gender,
    address,
    businessAddress,
    websiteAddress,
  } = data;
  return (
    <Flex direction="column" gapY="2">
      <Flex justify="between">
        <ProfileImage src={image ? image.secure_url : avatar ?? undefined} name={name} />

        <Button
          variant="faded"
          color="default"
          size="sm"
          radius="lg"
          as={NextLink}
          href="/dashboard/settings/profile/edit"
        >
          <Text size="4" weight="medium">
            Edit Profile
          </Text>
        </Button>
      </Flex>
      <Flex direction="row" justify="between">
        <Text size="6" weight="bold">
          {name}
        </Text>
        <Flex direction="row" gapX="2">
          {roles.map(
            ({ name, key, cn, Icon }) =>
              data[key as keyof typeof data] && (
                <Chip
                  key={key}
                  startContent={<Icon size={18} className="text-white dark:text-black" />}
                  variant="shadow"
                  className={cn}
                  classNames={{ content: "text-white dark:text-black" }}
                >
                  <Text size="3" weight="medium">
                    {name}
                  </Text>
                </Chip>
              )
          )}
        </Flex>
      </Flex>

      <Divider className="my-2" />
      <Flex direction="row" justify="between">
        <Flex gap="2" align="center">
          <Snippet className="bg-transparent" text="Email" />
          <Snippet text={email} />
        </Flex>

        <Chip
          startContent={isVerified ? <CheckIcon size={18} /> : <XIcon size={18} />}
          variant="faded"
          color={isVerified ? "success" : "danger"}
        >
          {isVerified ? "Verified" : "Not Verified"}
        </Chip>
      </Flex>

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

      <Divider className="my-2" />
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
              ).format("DDD MMMM YYYY")}
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
