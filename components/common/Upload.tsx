"use client";

import { Modify } from "@/lib/types";
import { Button } from "@nextui-org/button";
import { Card, CardFooter } from "@nextui-org/react";
import { Flex, Text } from "@radix-ui/themes";
import { CloudUploadIcon, Trash2Icon } from "lucide-react";
import { CldImage, CldUploadWidget, CldUploadWidgetProps } from "next-cloudinary";
import { useTheme } from "next-themes";
import { Dispatch, SetStateAction, useCallback } from "react";
import { useBeforeUnload, useUnmount } from "react-use";

interface CloudinaryResult {
  public_id: string;
}
type Props = Modify<
  CldUploadWidgetProps,
  {
    publicId: string[];
    setPublicId: Dispatch<SetStateAction<string[]>>;
    folder: string;
    multiple?: boolean;
    maxFiles?: number;
  }
>;
const Uoload = ({ publicId, setPublicId, folder, multiple = false, maxFiles, ...props }: Props) => {
  const { theme, systemTheme } = useTheme();
  const onAbort = useCallback(() => {
    if (publicId.length < 1) return false;
    setPublicId(publicId => {
      const ids = publicId.filter(id => id.startsWith("https"));
      const deleted = publicId.filter(id => !id.startsWith("https"));
      fetch("/api/admin/upload", { method: "DELETE", body: JSON.stringify({ publicId: deleted }) });
      return ids;
    });
    return true;
  }, [publicId.length, setPublicId]);
  useUnmount(onAbort);
  useBeforeUnload(onAbort, "You have unsaved changes, are you sure?");

  const handleDelete = async (id: string[]) => {
    const regex = new RegExp(`market-hub\/${folder}\/\\w+`);
    const ids = id.map(i => (i.startsWith("http") ? i.match(regex) : i));
    setPublicId(publicId => {
      fetch("/api/admin/upload", { method: "DELETE", body: JSON.stringify({ publicId: ids }) });
      return publicId.filter(i => !id.includes(i));
    });
  };
  return (
    <Flex direction="column" gap="5" justify="start" align="start">
      <Flex wrap="wrap" gap="4">
        {publicId?.length > 0 &&
          publicId?.map(id => (
            <Card key={id} className="h-[200px] w-[200px] border-none ">
              <Flex className="h-[200px] w-[200px]">
                <CldImage
                  key={id}
                  src={id}
                  alt={""}
                  width={200}
                  height={200}
                  className="rounded-md object-contain"
                />
              </Flex>
              <CardFooter className="absolute bottom-1 z-10 ml-1 h-[40px] w-[40px] rounded-large p-0">
                <Button
                  isIconOnly
                  variant="faded"
                  color="danger"
                  size="sm"
                  className="z-50"
                  radius="lg"
                  onPress={() => handleDelete([id])}
                >
                  <Trash2Icon size={20} />
                </Button>
              </CardFooter>
            </Card>
          ))}
      </Flex>

      <CldUploadWidget
        signatureEndpoint="/api/sign-cloudinary-params"
        options={{
          resourceType: "image",
          sources: ["local", "url", "camera", "image_search", "facebook", "dropbox", "instagram"],
          googleApiKey: process.env.NEXT_PUBLIC_CLOUDINARY_GOOGLE_API_KEY,
          showAdvancedOptions: false,
          cropping: false,
          folder: `market-hub/${folder}`,
          multiple,
          maxFiles,
          maxFileSize: 5_242_880, // 5MB
          defaultSource: "local",
          theme: "default",
          styles: {
            palette:
              (theme === "system" ? systemTheme : theme) === "dark"
                ? {
                    window: "#000000",
                    sourceBg: "#000000",
                    windowBorder: "#8E9FBF",
                    tabIcon: "#FFFFFF",
                    inactiveTabIcon: "#8E9FBF",
                    menuIcons: "#2AD9FF",
                    link: "#08C0FF",
                    action: "#336BFF",
                    inProgress: "#00BFFF",
                    complete: "#33ff00",
                    error: "#EA2727",
                    textDark: "#000000",
                    textLight: "#FFFFFF",
                  }
                : {
                    window: "#ffffff",
                    sourceBg: "#f4f4f5",
                    windowBorder: "#90a0b3",
                    tabIcon: "#000000",
                    inactiveTabIcon: "#555a5f",
                    menuIcons: "#555a5f",
                    link: "#0433ff",
                    action: "#339933",
                    inProgress: "#0433ff",
                    complete: "#339933",
                    error: "#cc0000",
                    textDark: "#000000",
                    textLight: "#fcfffd",
                  },
            fonts: {
              default: null,
              "'Fira Sans', sans-serif": {
                url: "https://fonts.googleapis.com/css?family=Fira+Sans",
                active: true,
              },
            },
          },
        }}
        onSuccess={(result, { widget }) => {
          setPublicId(publicIds => [...publicIds, (result.info as CloudinaryResult).public_id]);
        }}
        onAbort={onAbort}
        onError={async (error, widget) => {
          console.error("Upload error:", error);
          onAbort();
        }}
        {...props}
      >
        {({ open }) => (
          <Button
            startContent={<CloudUploadIcon />}
            variant="solid"
            color="primary"
            onClick={() => {
              if (!multiple) handleDelete(publicId);
              open();
            }}
          >
            <Text size="4" weight="medium">
              Images
            </Text>
          </Button>
        )}
      </CldUploadWidget>
    </Flex>
  );
};

export default Uoload;
