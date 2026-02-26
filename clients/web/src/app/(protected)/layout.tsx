import { SidebarProvider } from "@/components/primitives/sidebar";
import { CSSProperties } from "react";
import { cookies } from "next/headers";
import storage from "@/lib/core/storage";
import UserProvider from "@/lib/providers/user-provider";
import api from "@/api/server";

export default async function Layout(props: LayoutProps<"/">) {
  return (
    <UserProvider data={await api.user.dashboard()}>
      <SidebarProvider
        defaultOpen={
          (await cookies()).get(storage.preferences.sidebar.open)?.value !==
          "false"
        }
        style={
          {
            "--sidebar-width": "calc(var(--spacing) * 72)",
            "--header-height": "calc(var(--spacing) * 12)",
          } as CSSProperties
        }
      >
        {props.sidebar}
        {props.content}
      </SidebarProvider>
    </UserProvider>
  );
}
