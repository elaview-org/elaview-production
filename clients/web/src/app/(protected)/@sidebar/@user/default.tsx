"use client";

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
import { useRouter } from "next/navigation";
import { ProfileType } from "@/types/gql";
import api from "@/api/client";
import { BadgeCheck, Bell, LogOut, Settings } from "lucide-react";
import useUser from "@/lib/hooks/use-user";

export default function Default() {
  const { email, name, avatar, activeProfileType } = useUser();
  const router = useRouter();

  const { isMobile } = useSidebar();
  const { switchProfile, isPending: isSwitchPending } =
    api.auth.useSwitchProfile();
  const { logout, isPending: isLogoutPending } = api.auth.useLogout();
  const isPending = isSwitchPending || isLogoutPending;

  const targetProfile =
    activeProfileType === ProfileType.SpaceOwner
      ? ProfileType.Advertiser
      : ProfileType.SpaceOwner;

  const targetLabel =
    targetProfile === ProfileType.SpaceOwner ? "Space Owner" : "Advertiser";

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton size="lg">
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
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuGroup>
              <DropdownMenuItem onSelect={() => router.push("/profile")}>
                <BadgeCheck />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => router.push("/notifications")}>
                <Bell />
                Notifications
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => router.push("/messages")}>
                <IconMessage />
                Messages
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => router.push("/settings")}>
                <Settings />
                Settings
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem
                onSelect={() => switchProfile(targetProfile)}
                disabled={isPending}
              >
                <IconSwitchHorizontal
                  className={isPending ? "animate-pulse" : ""}
                />
                Switch to {targetLabel}
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={logout} disabled={isPending}>
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
