import { auth } from "@/auth";
import { Card, CardBody } from "@nextui-org/react";
import { redirect } from "next/navigation";
import AuthTabs from "./AuthTabs";
import { Flex } from "@radix-ui/themes";

const AuthPage = async () => {
  const session = await auth();

  // If the user is already logged in, redirect.
  // Note: Make sure not to redirect to the same page
  // To avoid an infinite loop!
  // if (session) {
  //   return redirect("/");
  // }

  return (
    <Flex direction="column" justify="center" align="center" py="8" height="100%" width="100%">
      <AuthTabs />
    </Flex>
  );
};

export default AuthPage;
