"use client";

import { Separator } from "@/components/primitives/separator";
import { SidebarTrigger } from "@/components/primitives/sidebar";
import { usePathname } from "next/dist/client/components/navigation";
import * as React from "react";
import { Fragment } from "react";
import Link from "next/link";
import { ThemeToggle } from "@/components/composed/theme-toggle";

export default function ContentHeader() {
  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        {usePathname()
          .slice(1)
          .split("/")
          .filter(Boolean)
          .map((fragment, index, array) => ({
            label: fragment
              .split("-")
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(" "),
            url: "/" + array.slice(0, index + 1).join("/"),
          }))
          .map(({ label, url }, index, fragments) => (
            <Fragment key={index}>
              {index > 0 && (
                <span className="text-muted-foreground mx-2">{" > "}</span>
              )}
              {index === fragments.length - 1 ? (
                <span className="text-foreground text-base font-medium">
                  {label}
                </span>
              ) : (
                <Link
                  href={url}
                  className="text-base font-medium hover:underline"
                >
                  {label}
                </Link>
              )}
            </Fragment>
          ))}
        <div className="ml-auto flex items-center gap-2">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
