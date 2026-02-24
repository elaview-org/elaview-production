import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/primitives/sidebar";
import { IconInnerShadowTop } from "@tabler/icons-react";

export default function Layout(props: LayoutProps<"/">) {
  return (
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
      <SidebarContent>{props.navigation}</SidebarContent>
      <SidebarFooter>{props.user}</SidebarFooter>
    </Sidebar>
  );
}