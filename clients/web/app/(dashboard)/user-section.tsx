"use client";

import { useTransition } from "react";
import { IconLogout, IconSwitchHorizontal } from "@tabler/icons-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/avatar";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/sidebar";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/tooltip";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Maybe, ProfileType } from "@/types/graphql.generated";
import { switchProfile } from "./switch-profile.action";

export interface NavUserProps {
  email: string;
  name: Maybe<string>;
  avatar: Maybe<string>;
  activeProfileType: ProfileType;
}

export function UserSection({
  email,
  name,
  avatar,
  activeProfileType,
}: NavUserProps) {
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
