"use client";

import { providerMap } from "@/auth";
import DividerWithLabel from "@/components/common/DividerWithLabel";
import { Icon as Iconify } from "@iconify/react";
import { Button } from "@nextui-org/react";
import { Tab, Tabs } from "@nextui-org/tabs";
import { Flex } from "@radix-ui/themes";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import SigninForm from "./SignInForm";
import SignupForm from "./SignupForm";

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
          <SigninForm setTab={setSelectedTab} />
        </Tab>
        <Tab key="sign-up" title="Sign up">
          <Flex direction="column" gap="3">
            <SignupForm setTab={setSelectedTab} />
          </Flex>
        </Tab>
      </Tabs>

      <DividerWithLabel label="Or continue with" />
      <Flex direction="column" gap="3" pt="2">
        {Object.values(providerMap).map(provider =>
          provider.id === "credentials" ? null : (
            <Button
              startContent={provider.icon && <Iconify icon={provider.icon} fontSize={24} />}
              variant="ghost"
              key={provider.id}
              onPress={e => signIn(provider.id)}
            >
              {provider.name}
            </Button>
          )
        )}
      </Flex>
    </Flex>
  );
};

export default AuthTabs;
