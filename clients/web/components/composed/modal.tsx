"use client";

import { useRouter } from "next/navigation";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/primitives/dialog";

type ModalProps = React.ComponentProps<typeof Dialog> & {
  route?: boolean;
};

function Modal({ route, ...props }: ModalProps) {
  const router = useRouter();

  if (route) {
    return (
      <Dialog
        defaultOpen
        onOpenChange={(open) => {
          if (!open) router.back();
        }}
        {...props}
      />
    );
  }

  return <Dialog {...props} />;
}

const ModalContent = DialogContent;
const ModalHeader = DialogHeader;
const ModalTitle = DialogTitle;
const ModalDescription = DialogDescription;
const ModalFooter = DialogFooter;
const ModalClose = DialogClose;
const ModalTrigger = DialogTrigger;

export {
  Modal,
  ModalClose,
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  ModalTrigger,
};
