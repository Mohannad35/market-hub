"use client";

import { Button } from "@nextui-org/button";
import { Text } from "@radix-ui/themes";
import { PlusCircleIcon, RefreshCw } from "lucide-react";

const ControlButtons = (props: ControlButtonsProps) => {
  const { isLoadingRefresh, isLoadingNew, onClickRefresh, onPressNew } = props;

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

      <Button
        color="default"
        variant="ghost"
        startContent={<PlusCircleIcon size={20} />}
        isLoading={isLoadingNew}
        onPress={onPressNew}
        className="max-w-40"
        size="md"
      >
        New Coupon
      </Button>
    </>
  );
};

export default ControlButtons;

interface ControlButtonsProps {
  isLoadingRefresh: boolean;
  isLoadingNew: boolean;
  onClickRefresh: () => Promise<void>;
  onPressNew: () => void;
}
