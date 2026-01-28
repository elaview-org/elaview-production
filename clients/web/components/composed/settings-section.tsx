"use client";

import { ReactNode } from "react";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/primitives/accordion";

type Props = {
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  children: ReactNode;
};

export default function SettingsSection({
  value,
  icon: Icon,
  title,
  description,
  children,
}: Props) {
  return (
    <AccordionItem value={value} className="rounded-lg border px-6">
      <AccordionTrigger className="text-base">
        <div className="flex items-center gap-3">
          <Icon className="text-muted-foreground size-5" />
          <div className="flex flex-col items-start gap-0.5">
            <span>{title}</span>
            <span className="text-muted-foreground text-sm font-normal">
              {description}
            </span>
          </div>
        </div>
      </AccordionTrigger>
      <AccordionContent>{children}</AccordionContent>
    </AccordionItem>
  );
}
