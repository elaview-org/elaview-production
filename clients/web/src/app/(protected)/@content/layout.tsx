"use client";

import { SidebarInset, SidebarTrigger } from "@/components/primitives/sidebar";
import { Separator } from "@/components/primitives/separator";
import { ThemeToggle } from "@/components/composed/theme-toggle";
import { ProfileType, UserRole } from "@/types/gql";
import { useUser } from "@/lib/providers/user-provider";
import useIsSharedRoute from "@/lib/hooks/use-is-shared-route";

export default function Layout(props: LayoutProps<"/">) {
  const { role, activeProfileType } = useUser();
  const isSharedRoute = useIsSharedRoute();

  return (
    <SidebarInset>
      <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
        <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mx-2 data-[orientation=vertical]:h-4"
          />
          <div className="ml-auto flex items-center gap-2">
            <ThemeToggle />
          </div>
        </div>
      </header>
      <div className="@container/main flex flex-1 flex-col gap-4 px-4 py-4 md:gap-6 md:py-6 lg:px-6">
        {isSharedRoute
          ? props.shared
          : (() => {
              switch (role) {
                case UserRole.Admin:
                  return props.admin;
                case UserRole.Marketing:
                  return props.marketing;
                case UserRole.User:
                  return activeProfileType === ProfileType.SpaceOwner
                    ? props.spaceOwner
                    : props.advertiser;
              }
            })()}
      </div>
    </SidebarInset>
  );
}
