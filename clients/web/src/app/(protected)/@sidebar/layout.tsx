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
import Link from "next/link";

export default function Layout(props: LayoutProps<"/">) {
  return (
    <Sidebar collapsible="icon" variant="sidebar">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton className="hover:bg-inherit active:bg-inherit data-[slot=sidebar-menu-button]:p-1.5!">
              <Link href="/" className="flex items-center gap-2">
                <IconInnerShadowTop className="size-5!" />
                <span className="text-base font-semibold">Elaview</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>{props.navigation}</SidebarContent>
      <SidebarFooter>{props.user}</SidebarFooter>
    </Sidebar>
  );
}
