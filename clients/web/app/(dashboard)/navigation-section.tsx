"use client";

import { useMemo } from "react";
import {
  IconBell,
  IconDots,
  IconFolder,
  IconShare3,
  IconTrash,
} from "@tabler/icons-react";

import { Button } from "@/components/primitives/button";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/primitives/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/primitives/dropdown-menu";
import {
  FragmentType,
  getFragmentData,
  graphql,
  ProfileType,
  UserRole,
} from "@/types/gql";
import adminData from "./@admin/navigation-bar.data";
import advertiserData from "./@advertiser/navigation-bar.data";
import marketingData from "./@marketing/navigation-bar.data";
import spaceOwnerData from "./@spaceOwner/navigation-bar.data";
import Link from "next/link";

const NavigationSection_UserFragment = graphql(`
  fragment NavigationSection_UserFragment on User {
    role
    activeProfileType
  }
`);

type Props = {
  data: FragmentType<typeof NavigationSection_UserFragment>;
};

export function NavigationSection({ data }: Props) {
  const { role, activeProfileType } = getFragmentData(
    NavigationSection_UserFragment,
    data
  );

  const { isMobile } = useSidebar();

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

  return (
    <>
      <SidebarGroup>
        <SidebarGroupContent className="flex flex-col gap-2">
          <SidebarMenu>
            <SidebarMenuItem className="flex items-center gap-2">
              <SidebarMenuButton
                asChild
                tooltip={roleData.quickAction.title}
                className="bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground min-w-8 duration-200 ease-linear"
              >
                <Link href={roleData.quickAction.url}>
                  <roleData.quickAction.icon />
                  <span>{roleData.quickAction.title}</span>
                </Link>
              </SidebarMenuButton>
              <Button
                size="icon"
                className="size-8 group-data-[collapsible=icon]:opacity-0"
                variant="outline"
                asChild
              >
                <Link href={"#"}>
                  <IconBell />
                  <span className="sr-only">Inbox</span>
                </Link>
              </Button>
            </SidebarMenuItem>
          </SidebarMenu>
          <SidebarMenu>
            {roleData.navMain.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild tooltip={item.title}>
                  <Link href={item.url}>
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
      <SidebarGroup className="group-data-[collapsible=icon]:hidden">
        <SidebarGroupLabel>Documents</SidebarGroupLabel>
        <SidebarMenu>
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
        </SidebarMenu>
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
