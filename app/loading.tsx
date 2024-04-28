import { Spinner } from "@nextui-org/spinner";
import { Flex } from "@radix-ui/themes";

const LoadingPage = () => {
  return (
    <Flex height="100%" width="100%" justify="center" align="center">
      <Spinner />
    </Flex>
  );
};

export default LoadingPage;
