"use client";

import { Tab, Tabs } from "@nextui-org/react";
import { Flex } from "@radix-ui/themes";
import { useEffect, useState } from "react";
import Signin from "./SignIn";
import Signup from "./Signup";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";

const AuthTabs = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedTab, setSelectedTab] = useState<string | number>("login");

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    switch (searchParams.get("error")) {
      case "OAuthAccountNotLinked":
        toast.error(
          "Another account already exists with the same e-mail address. Please sign in with that account."
        );
        params.delete("error");
        router.replace("?" + params.toString());
        break;
    }
  });

  return (
    <Flex direction="column" width={{ initial: "100%", xs: "30rem" }}>
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
