"use client";

import { Accordion } from "@/components/primitives/accordion";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export default function SettingsShell({ children }: Props) {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-8">
      <Accordion
        type="multiple"
        defaultValue={["profile"]}
        className="flex flex-col gap-4"
      >
        {children}
      </Accordion>
    </div>
  );
}
