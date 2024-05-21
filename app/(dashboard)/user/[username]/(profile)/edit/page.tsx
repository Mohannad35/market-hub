import EditProfileForm from "./EditProfileForm";

const EditProfilePage = ({ params: { username } }: { params: { username: string } }) => {
  return (
    <div className="container">
      <EditProfileForm username={username} />
    </div>
  );
};

export default EditProfilePage;
