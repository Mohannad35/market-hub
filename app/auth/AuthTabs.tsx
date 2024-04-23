"use client";

import { Tab, Tabs } from "@nextui-org/react";
import Signin from "./SignIn";
import Signup from "./Signup";
import { Flex } from "@radix-ui/themes";
import { useState } from "react";

const AuthTabs = () => {
  const [selectedTab, setSelectedTab] = useState<string | number>("login");

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
