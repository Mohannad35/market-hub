"use client";

import {
  Modal as NextOrgModal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@nextui-org/modal";
import { Button } from "@nextui-org/button";

interface Props {
  title: string;
  content: string;
  action: string;
  isOpen: boolean;
  isLoading?: boolean;
  onOpenChange: () => void;
  onAction: () => void;
}
const Modal = ({ title, content, action, isOpen, isLoading, onOpenChange, onAction }: Props) => {
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
              <Button color="primary" onPress={onAction} isLoading={isLoading}>
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
