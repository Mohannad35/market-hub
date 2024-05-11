import { Avatar, AvatarIcon, Button, Card, CardBody, Image } from "@nextui-org/react";
import { Flex } from "@radix-ui/themes";
import { Trash2Icon } from "lucide-react";
import { getCldImageUrl } from "next-cloudinary";
import NextImage from "next/image";

interface Props {
  src?: string | null;
  name: string;
  handleDelete: () => void;
}
const ProfileImage = ({ src, name, handleDelete }: Props) => {
  return (
    <Card radius="none" shadow="none" className="w-fit border-none bg-transparent">
      <CardBody className="w-fit items-center justify-center overflow-x-clip overflow-y-visible p-0">
        <Flex width="16rem" height="16rem" justify="center" align="center">
          <Image
            removeWrapper
            // radius="none"
            width={200}
            height={200}
            className="object-contain"
            as={NextImage}
            alt={name}
            src={src || getCldImageUrl({ src: "my-next-app/gcka5o2orshvf2mgm7vm", width: 200 })}
            fallbackSrc={getCldImageUrl({ src: "my-next-app/gcka5o2orshvf2mgm7vm", width: 200 })}
          />
        </Flex>
      </CardBody>

      <Button
        isIconOnly
        variant="faded"
        color="danger"
        size="sm"
        className="absolute bottom-1 right-1 z-50"
        radius="lg"
        onPress={handleDelete}
      >
        <Trash2Icon size={20} />
      </Button>
    </Card>
  );
};

export default ProfileImage;
