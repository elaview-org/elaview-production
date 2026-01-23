import api from "@/api/gql/server";
import { graphql } from "@/types/gql";
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
} from "@/components/primitives/sidebar";
import { IconInnerShadowTop } from "@tabler/icons-react";
import { NavigationSection } from "./navigation-section";
import { UserSection } from "./user-section";
import { CSSProperties } from "react";
import ContentHeader from "@/app/(dashboard)/content-header";
import { redirect } from "next/navigation";
import RoleBasedView from "@/app/(dashboard)/role-based-view";

export default async function Layout(props: LayoutProps<"/">) {
  const { data } = await api.query({
    query: graphql(`
      query DashboardUser {
        me {
          ...NavigationSection_UserFragment
          ...UserSection_UserFragment
          ...RoleBasedView_UserFragment
        }
      }
    `),
  });

  if (!data?.me) {
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
          <NavigationSection {...data.me} />
        </SidebarContent>
        <SidebarFooter>
          <UserSection {...data.me} />
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <ContentHeader />
        <RoleBasedView me={data.me} {...props} />
      </SidebarInset>
    </SidebarProvider>
  );
}
