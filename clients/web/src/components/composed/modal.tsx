"use client";

import { ReactNode } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/primitives/dialog";
import { cn } from "@/lib/core/utils";

type Props = Omit<React.ComponentProps<typeof Dialog>, "children"> & {
  title: string;
  description?: string;
  srOnly?: boolean;
  route?: boolean;
  size?: React.ComponentProps<typeof DialogContent>["size"];
  showCloseButton?: boolean;
  className?: string;
  children: ReactNode;
};

export default function Modal({
  title,
  description,
  srOnly,
  route,
  size,
  showCloseButton,
  className,
  children,
  ...dialogProps
}: Props) {
  const router = useRouter();

  const rootProps = route
    ? {
        defaultOpen: true,
        onOpenChange: (open: boolean) => {
          if (!open) router.back();
        },
        ...dialogProps,
      }
    : dialogProps;

  return (
    <Dialog {...rootProps}>
      <DialogContent
        size={size}
        showCloseButton={showCloseButton}
        className={className}
      >
        <DialogHeader className={cn(srOnly && "sr-only")}>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
}
