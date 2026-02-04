"use client";

import { ReactNode } from "react";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/primitives/accordion";

type Props = {
  value: string;
  icon: ReactNode;
  title: string;
  description: string;
  children: ReactNode;
};

export default function SettingsSection({
  value,
  icon,
  title,
  description,
  children,
}: Props) {
  return (
    <AccordionItem value={value} className="rounded-lg border px-6">
      <AccordionTrigger className="text-base">
        <div className="flex items-center gap-3">
          {icon}
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
