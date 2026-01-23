"use client";

import { useTransition } from "react";
import { IconLogout, IconSwitchHorizontal } from "@tabler/icons-react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/primitives/avatar";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/primitives/sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/primitives/tooltip";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FragmentType,
  getFragmentData,
  graphql,
  ProfileType,
} from "@/types/gql";
import { switchProfile } from "./switch-profile.action";

export const UserSection_UserFragment = graphql(`
  fragment UserSection_UserFragment on User {
    email
    name
    avatar
    activeProfileType
  }
`);

export function UserSection(
  props: FragmentType<typeof UserSection_UserFragment>
) {
  const { email, name, avatar, activeProfileType } = getFragmentData(
    UserSection_UserFragment,
    props
  );

  const [isPending, startTransition] = useTransition();
  const router = useRouter();

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

  return (
    <SidebarMenu>
      <SidebarMenuItem>
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
            <div className="flex items-center gap-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      handleSwitchProfile();
                    }}
                    disabled={isPending}
                    className="text-muted-foreground hover:text-foreground disabled:opacity-50"
                  >
                    <IconSwitchHorizontal
                      className={isPending ? "animate-pulse" : ""}
                    />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="top">
                  Switch to {targetLabel}
                </TooltipContent>
              </Tooltip>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  router.push("/logout");
                }}
                className="text-muted-foreground hover:text-foreground"
              >
                <IconLogout />
              </button>
            </div>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
