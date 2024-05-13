"use client";

import { Modify } from "@/lib/types";
import { Button } from "@nextui-org/button";
import { Card, CardFooter } from "@nextui-org/react";
import { Flex, Text } from "@radix-ui/themes";
import { uniq } from "lodash";
import { CloudUploadIcon, Trash2Icon } from "lucide-react";
import { CldImage, CldUploadWidget, CldUploadWidgetProps } from "next-cloudinary";
import { useTheme } from "next-themes";
import { Dispatch, SetStateAction, useCallback, useState } from "react";
import { useBeforeUnload, useUnmount } from "react-use";

interface CloudinaryResult {
  public_id: string;
  secure_url: string;
}
type Props = Modify<
  CldUploadWidgetProps,
  {
    resources: { public_id: string; secure_url: string }[];
    setResources: Dispatch<SetStateAction<{ public_id: string; secure_url: string }[]>>;
    temp: string[];
    setTemp: Dispatch<SetStateAction<string[]>>;
    setDeletedRes: Dispatch<SetStateAction<string[]>>;
    folder: string;
    multiple?: boolean;
    maxFiles?: number;
    cropping?: boolean;
  }
>;
/**
 * This component is a wrapper around the Cloudinary Upload Widget that handles image uploads.
 * It also displays the uploaded images and allows the user to delete them.
 * It also handles the deletion of images that were uploaded but not saved (user aborts creating or editing).
 * It requires the following props:
 * @property `resources` array to store the uploaded images and show them
 * @prop `setResources` set state function for the resources
 * @prop `temp` array to store the public_ids of the images that have been uploaded but not saved (to be deleted upon abort). Should be cleared on successful save
 * @prop `setTemp` set state function for the temp array
 * @prop `setDeletedRes` set state function for the deletedRes array (to store the public_ids of the images that should be deleted from Cloudinary on successful save)
 * @prop `folder` the folder in which the images should be stored in Cloudinary
 * @prop `multiple` whether the user can upload multiple images or not (default: false)
 * @prop `maxFiles` the maximum number of files the user can upload (default: undefined - no limit)
 * @returns
 */
const Uoload = ({
  resources,
  setResources,
  temp,
  setTemp,
  setDeletedRes,
  folder,
  multiple = false,
  maxFiles,
  cropping = false,
  ...props
}: Props) => {
  const { theme, systemTheme } = useTheme();
  // If the user aborts creating or editing, we delete temp images on unmount
  const onAbort = useCallback(() => {
    if (temp.length) {
      fetch("/api/admin/upload", {
        method: "DELETE",
        body: JSON.stringify({ publicId: temp }),
      });
      return true;
    }
    return false;
  }, [temp]);
  useUnmount(onAbort);
  useBeforeUnload(onAbort, "You have unsaved changes, are you sure?");

  const handleDelete = async (id: string[]) => {
    setResources(publicId => publicId.filter(({ public_id }) => !id.includes(public_id)));
    setDeletedRes(ids => uniq([...ids, ...id]));
  };
  return (
    <Flex direction="column" gap="5" justify="start" align="start">
      <Flex wrap="wrap" gap="4">
        {resources?.length > 0 &&
          resources?.map(({ public_id }) => (
            <Card key={public_id} className="h-[200px] w-[200px] border-none ">
              <Flex className="h-[200px] w-[200px]">
                <CldImage
                  key={public_id}
                  src={public_id}
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
                  onPress={() => handleDelete([public_id])}
                >
                  <Trash2Icon size={20} />
                </Button>
              </CardFooter>
            </Card>
          ))}
      </Flex>

      <CldUploadWidget
        uploadPreset="ml_default"
        signatureEndpoint="/api/sign-cloudinary-params"
        options={{
          resourceType: "image",
          sources: ["local", "url", "camera", "image_search", "facebook", "dropbox", "instagram"],
          googleApiKey: process.env.NEXT_PUBLIC_CLOUDINARY_GOOGLE_API_KEY,
          showAdvancedOptions: false,
          cropping: true,
          croppingAspectRatio: 1,
          showSkipCropButton: true,
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
          const { public_id, secure_url } = result.info as CloudinaryResult;
          setResources(publicIds => [...publicIds, { public_id, secure_url }]);
          setTemp(ids => [...ids, public_id]);
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
              if (!multiple) handleDelete(resources.map(({ public_id }) => public_id));
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
