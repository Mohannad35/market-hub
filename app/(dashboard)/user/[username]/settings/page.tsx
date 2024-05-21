import { auth } from "@/auth";


const SettingsPage = async () => {
  const session = await auth()

  return (
    <div className="container">
      Settings
    </div>
  );
};

export default SettingsPage;
