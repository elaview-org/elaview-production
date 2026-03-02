"use client";

import { useMemo } from "react";
import {
  IconUserScan,
} from "@tabler/icons-react";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/primitives/sidebar";
import { ProfileType, UserRole } from "@/types/gql";
import adminData from "@/app/(protected)/@content/@admin/navigation-bar.data";
import advertiserData from "@/app/(protected)/@content/@advertiser/navigation-bar.data";
import marketingData from "@/app/(protected)/@content/@marketing/navigation-bar.data";
import spaceOwnerData from "@/app/(protected)/@content/@spaceOwner/navigation-bar.data";
import Link from "next/link";
import { usePathname } from "next/navigation";
import useUser from "@/lib/hooks/use-user";

export default function Default() {
  const { role, activeProfileType } = useUser();

  const roleData = useMemo(() => {
    switch (role) {
      case UserRole.Admin:
        return adminData;
      case UserRole.Marketing:
        return marketingData;
      case UserRole.User: {
        return activeProfileType === ProfileType.SpaceOwner
          ? spaceOwnerData
          : advertiserData;
      }
    }
  }, [role, activeProfileType]);

  
  const pathname = usePathname();

  return (
    <>
      <SidebarGroup>
        <SidebarGroupContent className="flex flex-col gap-2">
          <SidebarMenu>
            <SidebarMenuItem className="flex items-center gap-2">
              <SidebarMenuButton
                asChild
                tooltip={roleData.title}
                className="bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground active:bg-primary active:text-primary-foreground min-w-8"
              >
                <div>
                  <IconUserScan />
                  <span>{roleData.title}</span>
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
          <SidebarMenu>
            {roleData.navMain.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  tooltip={item.title}
                  className={
                    item.url === pathname
                      ? "text-chart-2 pointer-events-none"
                      : ""
                  }
                >
                  {item.url !== pathname ? (
                    <Link href={item.url}>
                      {item.icon && <item.icon />}
                      <span>{item.title}</span>
                    </Link>
                  ) : (
                    <div className={"text-chart-2"}>
                      {item.icon && <item.icon />}
                      <span>{item.title}</span>
                    </div>
                  )}
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
      <SidebarGroup className="group-data-[collapsible=icon]:hidden">
        <SidebarGroupLabel>Documents</SidebarGroupLabel>
        {/* <SidebarMenu>
          {roleData.documents.map((item) => (
            <SidebarMenuItem key={item.name}>
              <SidebarMenuButton asChild>
                <a href={item.url}>
                  <item.icon />
                  <span>{item.name}</span>
                </a>
              </SidebarMenuButton>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuAction
                    showOnHover
                    className="data-[state=open]:bg-accent rounded-sm"
                  >
                    <IconDots />
                    <span className="sr-only">More</span>
                  </SidebarMenuAction>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-24 rounded-lg"
                  side={isMobile ? "bottom" : "right"}
                  align={isMobile ? "end" : "start"}
                >
                  <DropdownMenuItem>
                    <IconFolder />
                    <span>Open</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <IconShare3 />
                    <span>Share</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem variant="destructive">
                    <IconTrash />
                    <span>Delete</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          ))}
        </SidebarMenu> */}
      </SidebarGroup>
      <SidebarGroup className={"mt-auto"}>
        <SidebarGroupContent>
          <SidebarMenu>
            {roleData.navSecondary.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild>
                  <a href={item.url}>
                    <item.icon />
                    <span>{item.title}</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </>
  );
}
