import { Spinner } from "@nextui-org/spinner";
import { Flex } from "@radix-ui/themes";
import React from "react";

const LoadingIndicator = () => {
  return (
    <Flex width="100%" height="100%" justify="center" align="center">
      <Spinner />
    </Flex>
  );
};

export default LoadingIndicator;
