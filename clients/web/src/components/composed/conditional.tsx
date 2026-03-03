import type { ReactNode } from "react";
import { cn } from "@/lib/core/utils";

type Props = {
  condition: boolean;
  children: ReactNode;
  fallback: ReactNode;
  className?: string;
};

export default function Conditional(props: Props) {
  return (
    <div className={cn(props.className)}>
      {props.condition ? props.children : props.fallback}
    </div>
  );
}
