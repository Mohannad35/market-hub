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
      radius="none"
      width={200}
      height={200}
      className="object-contain"
      as={NextImage}
      alt={name}
      src={src || getCldImageUrl({ src: "my-next-app/gcka5o2orshvf2mgm7vm", width: 200 })}
      fallbackSrc={getCldImageUrl({ src: "my-next-app/gcka5o2orshvf2mgm7vm", width: 200 })}
    />
  );
};

export default ProfileImage;
