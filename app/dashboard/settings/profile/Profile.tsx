"use client";

import LoadingIndicator from "@/components/common/LoadingIndicator";
import { getProfile } from "@/lib/query-functions/user";
import { Chip, Divider } from "@nextui-org/react";
import { User } from "@prisma/client";
import { Flex, Text } from "@radix-ui/themes";
import { useQuery } from "@tanstack/react-query";
import { CheckIcon, XIcon } from "lucide-react";
import { FaCircleCheck, FaCircleXmark } from "react-icons/fa6";
import ProfileImage from "./ProfileImage";

const roles = [
  { name: "Admin", key: "isAdmin", color: "#7469B6", Icon: FaCircleCheck },
  { name: "Support", key: "isSupport", color: "#f5a524", Icon: FaCircleCheck },
  { name: "Vendor", key: "isVendor", color: "#17c964", Icon: FaCircleCheck },
  { name: "Banned", key: "isBanned", color: "#f31260", Icon: FaCircleXmark },
];

const Profile = () => {
  const { data, error, isSuccess, isLoading } = useQuery<User>({
    queryKey: ["getProfile"],
    queryFn: getProfile,
  });

  const handleDelete = () => {
    console.log("delete");
  };

  if (isLoading) return <LoadingIndicator />;
  else if (error) return <div className="container">Error: {error.message}</div>;
  else if (!isSuccess || !data) return <div className="container">No data</div>;
  const {
    name,
    email,
    image,
    isVerified,
    address,
    birthday,
    businessAddress,
    gender,
    phoneNumber,
    websiteAddress,
  } = data;
  return (
    <Flex direction="column" gapY="2">
      <ProfileImage src={image} name={name} handleDelete={handleDelete} />
      <Flex direction="row" justify="between">
        <Text size="6" weight="bold">
          {name}
        </Text>
        <Flex direction="row" gapX="2">
          {roles.map(
            ({ name, key, color, Icon }) =>
              data[key as keyof typeof data] && (
                <Chip
                  key={key}
                  startContent={<Icon size={18} className="text-white dark:text-black" />}
                  variant="shadow"
                  className={`bg-[${color}] shadow-[${color}]/50`}
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
        <Text size="4" weight="medium">
          {email}
        </Text>
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
          <Text size="4" weight="medium">
            {phoneNumber}
          </Text>
        </>
      )}

      {gender && (
        <>
          <Divider className="my-2" />
          <Text size="4" weight="medium">
            {gender}
          </Text>
        </>
      )}

      {birthday && (
        <>
          <Divider className="my-2" />
          <Text size="4" weight="medium">
            {birthday.toLocaleString()}
          </Text>
        </>
      )}

      {address && (
        <>
          <Divider className="my-2" />
          <Text size="4" weight="medium">
            {address}
          </Text>
        </>
      )}

      {businessAddress && (
        <>
          <Divider className="my-2" />
          <Text size="4" weight="medium">
            {businessAddress}
          </Text>
        </>
      )}

      {websiteAddress && (
        <>
          <Divider className="my-2" />
          <Text size="4" weight="medium">
            {websiteAddress}
          </Text>
        </>
      )}
    </Flex>
  );
};

export default Profile;
