"use client";

import { providerMap } from "@/auth";
import DividerWithLabel from "@/components/DividerWithLabel";
import { Button } from "@nextui-org/react";
import { Flex } from "@radix-ui/themes";
import { signIn } from "next-auth/react";
import SigninForm from "./SignInForm";

const Signin = () => {
  return (
    <Flex direction="column" gap="3">
      <SigninForm />

      <DividerWithLabel label="Or continue with" />

      {Object.values(providerMap).map(provider =>
        provider.id === "credentials" ? null : (
          <Button
            startContent={provider.icon && <provider.icon size={20} />}
            variant="ghost"
            key={provider.id}
            onPress={e => signIn(provider.id)}
          >
            {provider.name}
          </Button>
        )
      )}
    </Flex>
  );
};

export default Signin;
