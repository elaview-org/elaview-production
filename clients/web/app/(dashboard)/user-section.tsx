"use client";

import { IconLogout } from "@tabler/icons-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/avatar";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/sidebar";
import Link from "next/link";
import { Maybe } from "@/types/graphql.generated";

export interface NavUserProps {
  email: string;
  name: Maybe<string>; // todo: backend: name should be required
  avatar: Maybe<string>;
}

export function UserSection({ email, name, avatar }: NavUserProps) {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton size="lg">
          <Avatar className="h-8 w-8 rounded-[50%] grayscale">
            <AvatarImage
              src={avatar as string | Blob | undefined}
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
          <Link href="/logout">
            <IconLogout className={"text-muted-foreground"} />
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
