"use client";

import { Button } from "@nextui-org/button";
import { Flex } from "@radix-ui/themes";
import { CloudUploadIcon } from "lucide-react";
import { CldImage, CldUploadWidget } from "next-cloudinary";
import { useTheme } from "next-themes";
import { Dispatch, SetStateAction } from "react";

interface CloudinaryResult {
  public_id: string;
}

interface UoloadProps {
  publicId: string[];
  setPublicId: Dispatch<SetStateAction<string[]>>;
}

const Uoload = ({ publicId, setPublicId }: UoloadProps) => {
  const { theme, systemTheme } = useTheme();

  const onAbort = async () => {
    if (publicId?.length < 1) return;
    setPublicId(publicId => {
      fetch("/api/admin/upload", { method: "DELETE", body: JSON.stringify({ publicId }) });
      return [];
    });
  };

  return (
    <Flex direction="column" gap="5" justify="start" align="start">
      <div className="flex flex-wrap">
        {publicId?.length > 0 &&
          publicId?.map(id => (
            <CldImage
              className="object-contain p-5"
              key={id}
              src={id}
              alt={""}
              width={270}
              height={180}
            />
          ))}
      </div>

      <CldUploadWidget
        uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
        options={{
          folder: "products",
          resourceType: "image",
          sources: ["local", "url", "camera", "image_search", "facebook", "dropbox", "instagram"],
          googleApiKey: process.env.NEXT_PUBLIC_CLOUDINARY_GOOGLE_API_KEY,
          showAdvancedOptions: false,
          cropping: false,
          multiple: true,
          maxFiles: 5,
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
      >
        {({ open }) => {
          function handleOnClick() {
            onAbort();
            open();
          }
          return (
            <Button
              startContent={<CloudUploadIcon />}
              variant="solid"
              color="primary"
              onClick={handleOnClick}
            >
              Images
            </Button>
          );
        }}
      </CldUploadWidget>
    </Flex>
  );
};

export default Uoload;
