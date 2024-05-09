import { Spinner } from "@nextui-org/spinner";
import { Flex } from "@radix-ui/themes";

const loadingProductDetails = () => {
  return (
    <Flex width="100%" height="100%" justify="center" align="center">
      <Spinner color="primary" />
    </Flex>
  );
};

export default loadingProductDetails;
