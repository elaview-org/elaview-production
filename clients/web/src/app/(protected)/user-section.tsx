"use client";

import { useTransition } from "react";
import { IconMessage, IconSwitchHorizontal } from "@tabler/icons-react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/primitives/avatar";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/primitives/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/primitives/dropdown-menu";
import Link from "next/link";
import {
  FragmentType,
  getFragmentData,
  graphql,
  ProfileType,
} from "@/types/gql";
import { logout, switchProfile } from "@/lib/services/auth.actions";
import { BadgeCheck, Bell, LogOut, Settings } from "lucide-react";

export const UserSection_UserFragment = graphql(`
  fragment UserSection_UserFragment on User {
    email
    name
    avatar
    activeProfileType
  }
`);

type Props = {
  data: FragmentType<typeof UserSection_UserFragment>;
};

export function UserSection({ data }: Props) {
  const { email, name, avatar, activeProfileType } = getFragmentData(
    UserSection_UserFragment,
    data
  );

  const [isPending, startTransition] = useTransition();
  const { isMobile } = useSidebar();

  const targetProfile =
    activeProfileType === ProfileType.SpaceOwner
      ? ProfileType.Advertiser
      : ProfileType.SpaceOwner;

  const targetLabel =
    targetProfile === ProfileType.SpaceOwner ? "Space Owner" : "Advertiser";

  function handleSwitchProfile() {
    startTransition(async () => {
      await switchProfile(targetProfile);
    });
  }

  function handleLogout() {
    startTransition(async () => {
      await logout();
    });
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/profile">
                <Avatar className="h-8 w-8 rounded-[50%] grayscale">
                  <AvatarImage
                    src={avatar as string | undefined}
                    alt={name as string | undefined}
                  />
                  <AvatarFallback>A</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{name}</span>
                  <span className="text-muted-foreground truncate text-xs">
                    {email}
                  </span>
                </div>
                <div className="flex items-center gap-1"></div>
              </Link>
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <Link href="/profile">
                  <BadgeCheck />
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/notifications">
                  <Bell />
                  Notifications
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/messages">
                  <IconMessage />
                  Messages
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/settings">
                  <Settings />
                  Settings
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem
                onSelect={handleSwitchProfile}
                disabled={isPending}
              >
                <IconSwitchHorizontal
                  className={isPending ? "animate-pulse" : ""}
                />
                Switch to {targetLabel}
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={handleLogout} disabled={isPending}>
                <LogOut />
                Logout
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
