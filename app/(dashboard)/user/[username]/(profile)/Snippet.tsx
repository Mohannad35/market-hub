"use client";

import { Snippet as NextSnippet, SnippetProps } from "@nextui-org/snippet";

interface Props extends SnippetProps {
  // Add your custom props here
  text?: string;
}
const Snippet = ({ text, children, hideCopyButton, hideSymbol, ...props }: Props) => {
  return (
    <NextSnippet
      variant="flat"
      hideSymbol
      hideCopyButton
      classNames={{ pre: "text-lg font-fira_code" }}
      {...props}
    >
      {text} {children}
    </NextSnippet>
  );
};

export default Snippet;
