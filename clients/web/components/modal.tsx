"use client";

import { ReactNode } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/dialog";

interface ModalProps {
  title?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  showCloseButton?: boolean;
  size?: "sm" | "default" | "lg" | "xl" | "full";
}

export default function Modal({
  title,
  children,
  footer,
  showCloseButton = true,
  size = "default",
}: ModalProps) {
  const router = useRouter();

  return (
    <Dialog defaultOpen={true} open={true} onOpenChange={() => router.back()}>
      <DialogContent showCloseButton={showCloseButton} size={size}>
        {title && (
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
          </DialogHeader>
        )}
        {children}
        {footer && <DialogFooter>{footer}</DialogFooter>}
      </DialogContent>
    </Dialog>
  );
}
