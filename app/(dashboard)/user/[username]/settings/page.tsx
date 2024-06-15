import { auth, signIn } from "@/auth";
import { getProfile } from "@/lib/query-functions/user";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import SettingTabs from "./SettingTabs";

const SettingsPage = async () => {
  const session = await auth();
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({ queryKey: ["getProfile"], queryFn: getProfile });

  if (!session) return signIn();
  const { user } = session;
  return (
    <div className="w-full">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <SettingTabs username={user.username} />
      </HydrationBoundary>
    </div>
  );
};

export default SettingsPage;
