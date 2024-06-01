"use client";

import { Button } from "@nextui-org/button";
import { Text } from "@radix-ui/themes";
import { RefreshCw } from "lucide-react";

const ControlButtons = (props: ControlButtonsProps) => {
  const { isLoadingRefresh, onClickRefresh } = props;

  return (
    <>
      <Button
        isIconOnly
        isLoading={isLoadingRefresh}
        spinner={<RefreshCw size={20} className="animate-spin" />}
        onClick={onClickRefresh}
        color="default"
        variant="light"
        size="md"
      >
        <RefreshCw size={20} />
        <Text className="sr-only">Refresh table data</Text>
      </Button>
    </>
  );
};

export default ControlButtons;

interface ControlButtonsProps {
  isLoadingRefresh: boolean;
  onClickRefresh: () => Promise<void>;
}
