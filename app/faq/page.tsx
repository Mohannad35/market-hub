import { Flex, Text } from "@radix-ui/themes";
import FAQs from "./FAQs";

const FAQpage = () => {
  return (
    <div className="container">
      <Flex
        width="100%"
        align={{ initial: "center", md: "start" }}
        direction={{ initial: "column", md: "row" }}
        gap={{ initial: "6", md: "9" }}
        pt="9"
        px="9"
        mx="auto"
        maxWidth="60rem"
      >
        <Text
          size="8"
          className="bg-gradient-to-br from-foreground-800 to-foreground-500 bg-clip-text pt-4 font-semibold tracking-tight text-transparent dark:to-foreground-200 lg:inline-block"
        >
          Frequently
          <br />
          asked
          <br />
          questions
        </Text>
        <FAQs />
      </Flex>
    </div>
  );
};

export default FAQpage;
