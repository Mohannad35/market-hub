import { getProfile } from "@/lib/query-functions/user";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { ReactNode } from "react";

const ProfileLayout = async ({ children }: Readonly<{ children: ReactNode }>) => {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({ queryKey: ["getProfile"], queryFn: getProfile });

  return (
    <div>
      <HydrationBoundary state={dehydrate(queryClient)}>{children}</HydrationBoundary>
    </div>
  );
};

export default ProfileLayout;
