import { Spinner } from "@nextui-org/spinner";
import { Flex } from "@radix-ui/themes";

const LoadingPage = () => {
  return (
    <Flex width="100%" height="100%" justify="center" align="center">
      <Spinner />
    </Flex>
  );
};

export default LoadingPage;
