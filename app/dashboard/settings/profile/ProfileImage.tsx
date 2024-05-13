import { Avatar, AvatarIcon, Button, Card, CardBody, Image } from "@nextui-org/react";
import { Flex } from "@radix-ui/themes";
import { Trash2Icon } from "lucide-react";
import { getCldImageUrl } from "next-cloudinary";
import NextImage from "next/image";

interface Props {
  src?: string | null;
  name: string;
}
const ProfileImage = ({ src, name }: Props) => {
  return (
    // <Flex width="16rem" height="16rem" justify="center" align="center">
    <Image
      removeWrapper
      radius="none"
      width={200}
      height={200}
      className="object-contain"
      as={NextImage}
      alt={name}
      src={src || getCldImageUrl({ src: "my-next-app/gcka5o2orshvf2mgm7vm", width: 200 })}
      fallbackSrc={getCldImageUrl({ src: "my-next-app/gcka5o2orshvf2mgm7vm", width: 200 })}
    />
    // </Flex>
  );
};

export default ProfileImage;
