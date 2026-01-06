import api from "@/shared/api/gql/server";
import { Query, UserRole } from "@/shared/types/graphql.generated";
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
} from "@/shared/components/sidebar";
import { IconInnerShadowTop } from "@tabler/icons-react";
import { NavigationSection } from "./navigation-section";
import { UserSection } from "./user-section";

import { CSSProperties } from "react";
import assert from "node:assert";
import ContentHeader from "@/app/(dashboard)/content-header";

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
        <ContentHeader />
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
