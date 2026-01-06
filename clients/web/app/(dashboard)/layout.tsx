import api from "@/shared/api/gql/server";
import { Query, UserRole } from "@/shared/types/graphql.generated";
import { Separator } from "@/shared/components/separator";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/shared/components/sidebar";
import { ThemeToggle } from "@/shared/components/theme-toggle";
import { IconInnerShadowTop } from "@tabler/icons-react";
import { NavigationSection } from "./navigation-section";
import { UserSection } from "./user-section";

import { CSSProperties } from "react";
import assert from "node:assert";

export default async function Layout(props: LayoutProps<"/">) {
  const { data } = await api.query<Query>({
    query: api.gql`
      query {
        currentUser {
          id,
          email,
          name,
          avatar,
          role,
        }
      }
    `,
  });

  assert(!!data?.currentUser);

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as CSSProperties
      }
    >
      <Sidebar variant={"inset"} collapsible="offcanvas">
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                className="data-[slot=sidebar-menu-button]:p-1.5!"
              >
                <a href="#">
                  <IconInnerShadowTop className="size-5!" />
                  <span className="text-base font-semibold">Elaview</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <NavigationSection userRole={data?.currentUser?.role} />
        </SidebarContent>
        <SidebarFooter>
          <UserSection {...data?.currentUser} />
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
          <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mx-2 data-[orientation=vertical]:h-4"
            />
            <h1 className="text-base font-medium">Documents</h1>
            <div className="ml-auto flex items-center gap-2">
              <ThemeToggle />
            </div>
          </div>
        </header>
        {(() => {
          switch (data.currentUser.role) {
            case UserRole.Admin:
              return props.admin;
            case UserRole.Advertiser:
              return props.advertiser;
            case UserRole.Marketing:
              return props.marketing;
            case UserRole.SpaceOwner:
              return props.spaceOwner;
          }
        })()}
      </SidebarInset>
    </SidebarProvider>
  );
}
