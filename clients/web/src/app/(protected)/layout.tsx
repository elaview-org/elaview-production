import { SidebarProvider } from "@/components/primitives/sidebar";
import { CSSProperties } from "react";
import { cookies } from "next/headers";
import storage from "@/lib/core/storage";
import UserProvider from "@/lib/providers/user-provider";
import api from "@/api/server";

import { ReactNode } from "react";

export default async function Layout({
  navigation,
  user,
  content,
}: LayoutProps<"/"> & {
  navigation: ReactNode;
  user: ReactNode;
  content: ReactNode;
}) {
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
        {navigation}
        {user}
        {content}
      </SidebarProvider>
    </UserProvider>
  );
}
