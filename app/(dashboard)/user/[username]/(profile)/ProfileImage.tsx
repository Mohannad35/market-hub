"use client";

import { Image } from "@nextui-org/react";
import { getCldImageUrl } from "next-cloudinary";
import NextImage from "next/image";

interface Props {
  src?: string | null;
  name: string;
}
const ProfileImage = ({ src, name }: Props) => {
  return (
    <Image
      removeWrapper
      radius="full"
      width={720}
      height={720}
      className="object-contain w-56"
      as={NextImage}
      alt={name}
      src={src || getCldImageUrl({ src: "my-next-app/gcka5o2orshvf2mgm7vm", width: 200 })}
      fallbackSrc={getCldImageUrl({ src: "my-next-app/gcka5o2orshvf2mgm7vm", width: 200 })}
    />
  );
};

export default ProfileImage;
