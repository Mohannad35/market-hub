import { auth } from "@/auth";
import Profile from "./Profile";

const ProfilePage = async () => {
  const session = await auth();
  if (!session?.user) return null;

  return (
    <div className="container">
      <Profile />
    </div>
  );
};

export default ProfilePage;
