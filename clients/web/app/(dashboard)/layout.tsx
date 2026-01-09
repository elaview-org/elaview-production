import api from "@/api/gql/server";
import { ProfileType, Query, UserRole } from "@/types/graphql.generated";
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
} from "@/components/sidebar";
import { IconInnerShadowTop } from "@tabler/icons-react";
import { NavigationSection } from "./navigation-section";
import { UserSection } from "./user-section";

import { CSSProperties } from "react";
import ContentHeader from "@/app/(dashboard)/content-header";
import { redirect } from "next/navigation";

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
          activeProfileType,
        }
      }
    `,
  });

  if (!data?.currentUser) {
    redirect("/logout");
  }

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
          <NavigationSection
            userRole={data?.currentUser?.role}
            activeProfileType={data?.currentUser?.activeProfileType}
          />
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
            case UserRole.Marketing:
              return props.marketing;
            case UserRole.User: {
              return data.currentUser.activeProfileType ===
                ProfileType.SpaceOwner
                ? props.spaceOwner
                : props.advertiser;
            }
          }
        })()}
      </SidebarInset>
    </SidebarProvider>
  );
}
