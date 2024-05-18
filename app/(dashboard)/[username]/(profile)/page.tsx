import Profile from "./Profile";

interface Params {
  params: { username: string };
}

const ProfilePage = async ({ params: { username } }: Params) => {
  return (
    <div className="container">
      <Profile username={username} />
    </div>
  );
};

export default ProfilePage;
