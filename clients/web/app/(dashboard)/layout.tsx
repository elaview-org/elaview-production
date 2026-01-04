import {SidebarInset, SidebarProvider} from "@/shared/components/ui/sidebar";
import {AppSidebar} from "@/shared/components/app-sidebar";
import {SiteHeader} from "@/shared/components/site-header";
import {CSSProperties} from "react";

type Role = "admin" | "advertiser" | "marketing" | "space-owner" | null;
const role: Role = "admin";

export default function Layout(props: LayoutProps<"/">) {
    return <SidebarProvider
        style={
            {
                "--sidebar-width": "calc(var(--spacing) * 72)",
                "--header-height": "calc(var(--spacing) * 12)",
            } as CSSProperties
        }
    >
        <AppSidebar variant="inset"/>
        <SidebarInset>
            <SiteHeader/>
            {(() => {
                switch (role) {
                    case "admin":
                        return props.admin;
                    case "advertiser":
                        return props.advertiser;
                    case "marketing":
                        return props.marketing;
                    case "space-owner":
                        return props.spaceOwner;
                }
            })()}
        </SidebarInset>
    </SidebarProvider>;
}