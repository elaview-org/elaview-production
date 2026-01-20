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
        me {
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
          <NavigationSection
            userRole={data?.me?.role}
            activeProfileType={data?.me?.activeProfileType}
          />
        </SidebarContent>
        <SidebarFooter>
          <UserSection {...data?.me} />
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <ContentHeader />
        <div className="@container/main flex flex-1 flex-col gap-4 px-4 py-4 md:gap-6 md:py-6 lg:px-6">
          {(() => {
            switch (data.me.role) {
              case UserRole.Admin:
                return props.admin;
              case UserRole.Marketing:
                return props.marketing;
              case UserRole.User: {
                return data.me.activeProfileType === ProfileType.SpaceOwner
                  ? props.spaceOwner
                  : props.advertiser;
              }
            }
          })()}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
