"use client";

import { Tab, Tabs } from "@nextui-org/tabs";
import { Flex } from "@radix-ui/themes";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Signin from "./SignIn";
import Signup from "./Signup";
import { toast } from "sonner";

const AuthTabs = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedTab, setSelectedTab] = useState<string | number>("login");

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    const error = searchParams.get("error");
    switch (error) {
      case "OAuthAccountNotLinked":
        toast.error(
          "Another account already exists with the same e-mail address. Please sign in with that account."
        );
        params.delete("error");
        params.delete("code");
        router.replace("?" + params.toString());
        break;
      default:
        if (error) {
          toast.error(error);
          params.delete("error");
          params.delete("code");
          router.replace("?" + params.toString());
        }
        break;
    }
  });

  return (
    <Flex direction="column" width={{ initial: "100%", xs: "40rem" }}>
      <Tabs
        defaultSelectedKey={"login"}
        size="lg"
        aria-label="Sign in and sign up forms"
        color="default"
        variant="underlined"
        fullWidth
        selectedKey={selectedTab}
        onSelectionChange={setSelectedTab}
      >
        <Tab key="login" title="Login">
          <Signin />
        </Tab>
        <Tab key="sign-up" title="Sign up">
          <Signup setTab={setSelectedTab} />
        </Tab>
      </Tabs>
    </Flex>
  );
};

export default AuthTabs;
