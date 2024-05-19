"use client";

import { Button } from "@nextui-org/button";
import {
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Modal as NextOrgModal,
} from "@nextui-org/modal";
import { ReactNode } from "react";

interface Props {
  title: string;
  content: string;
  action: string;
  isOpen: boolean;
  isLoading?: boolean;
  startContent?: ReactNode;
  onOpenChange: () => void;
  onAction: () => void;
}
const Modal = ({
  title,
  content,
  action,
  isOpen,
  isLoading,
  startContent,
  onOpenChange,
  onAction,
}: Props) => {
  // const { isOpen, onOpen, onOpenChange } = useDisclosure({});
  return (
    <NextOrgModal isOpen={isOpen} onOpenChange={onOpenChange} className="font-inter">
      <ModalContent>
        {onClose => (
          <>
            <ModalHeader>{title}</ModalHeader>
            <ModalBody>{content}</ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                <span className="text-medium font-medium">Close</span>
              </Button>
              <Button
                color="primary"
                onPress={onAction}
                isLoading={isLoading}
                startContent={startContent}
              >
                <span className="text-medium font-medium">{action}</span>
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </NextOrgModal>
  );
};

export default Modal;
