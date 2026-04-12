import Profile from "./Profile";

interface Params {
  params: Promise<{ username: string }>;
}

const ProfilePage = async ({ params }: Params) => {
  const { username } = await params;
  return (
    <div className="w-full">
      <Profile username={username} />
    </div>
  );
};

export default ProfilePage;
