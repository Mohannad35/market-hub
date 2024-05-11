import { auth } from "@/auth";
import { getProfile } from "@/lib/query-functions/user";
import { Image } from "@nextui-org/react";
import { User } from "@prisma/client";
import { Flex } from "@radix-ui/themes";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { getCldImageUrl } from "next-cloudinary";
import NextImage from "next/image";
import Profile from "./Profile";

const ProfilePage = async () => {
  const session = await auth();
  if (!session?.user) return null;

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({ queryKey: ["getProfile"], queryFn: getProfile });

  return (
    <div className="container">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Profile />
      </HydrationBoundary>
    </div>
  );
};

export default ProfilePage;
