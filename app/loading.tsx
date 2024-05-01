import { Spinner } from "@nextui-org/spinner";
import { Flex } from "@radix-ui/themes";

const LoadingPage = () => {
  return (
    <Flex className="h-[calc(100vh-120px)]" width="100%" justify="center" align="center">
      <Spinner />
    </Flex>
  );
};

export default LoadingPage;
