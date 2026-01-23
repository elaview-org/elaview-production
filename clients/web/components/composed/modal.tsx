import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/primitives/dialog";
import * as React from "react";
import { ReactNode } from "react";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

interface ModalProps extends React.ComponentProps<typeof Dialog> {
  title?: string;
  trigger?: ReactNode;
  children: ReactNode;
  className?: string;
}

export default function Modal({
  title,
  trigger,
  children,
  className,
  ...dialogProps
}: ModalProps) {
  return (
    <Dialog {...dialogProps}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className={className}>
        <DialogHeader>
          {title ? (
            <DialogTitle>{title}</DialogTitle>
          ) : (
            <VisuallyHidden>
              <DialogTitle />
            </VisuallyHidden>
          )}
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
}
