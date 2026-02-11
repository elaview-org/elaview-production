import api from "@/lib/gql/server";
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
import ContentHeader from "@/app/(protected)/content-header";
import RoleBasedView from "@/app/(protected)/role-based-view";
import { cookies } from "next/headers";
import storage from "@/lib/core/storage";
import assert from "node:assert";

export default async function Layout(props: LayoutProps<"/">) {
  const sidebarOpen =
    (await cookies()).get(storage.preferences.sidebar.open)?.value !== "false";

  const me = await api
    .query({
      query: graphql(`
        query DashboardUser {
          me {
            id
            ...NavigationSection_UserFragment
            ...UserSection_UserFragment
            ...RoleBasedView_UserFragment
          }
        }
      `),
    })
    .then((res) => {
      assert(!!res.data?.me);
      return res.data?.me;
    });

  return (
    <SidebarProvider
      defaultOpen={sidebarOpen}
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as CSSProperties
      }
    >
      <Sidebar collapsible="icon">
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton className="hover:bg-inherit active:bg-inherit data-[slot=sidebar-menu-button]:p-1.5!">
                <IconInnerShadowTop className="size-5!" />
                <span className="text-base font-semibold">Elaview</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <NavigationSection data={me} />
        </SidebarContent>
        <SidebarFooter>
          <UserSection data={me} />
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <ContentHeader />
        <RoleBasedView data={me} {...props} />
      </SidebarInset>
    </SidebarProvider>
  );
}
