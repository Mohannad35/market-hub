import { getProfile } from "@/lib/query-functions/user";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { ReactNode } from "react";

type Props = Readonly<{ children: ReactNode; params: { username: string } }>;
const ProfileLayout = async ({ children, params: { username } }: Props) => {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({ queryKey: ["getProfile", username], queryFn: getProfile });

  return (
    <div>
      <HydrationBoundary state={dehydrate(queryClient)}>{children}</HydrationBoundary>
    </div>
  );
};

export default ProfileLayout;
