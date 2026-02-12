"use client";

import { Search, ArrowUpDown, Check } from "lucide-react";
import { Input } from "@/components/primitives/input";
import { Button } from "@/components/primitives/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/primitives/dropdown-menu";

export type SortOption = "recent" | "unread";

type Props = {
  conversationCount: number;
  unreadCount?: number;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
};

export default function MessagesHeader({
  conversationCount,
  unreadCount = 0,
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
}: Props) {
  return (
    <div className="space-y-3 border-b px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h1 className="text-lg font-semibold">Messages</h1>
          {unreadCount > 0 && (
            <span className="bg-primary text-primary-foreground rounded-full px-2 py-0.5 text-xs font-medium">
              {unreadCount}
            </span>
          )}
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 gap-1">
              <ArrowUpDown className="size-4" />
              <span className="text-xs">
                {sortBy === "recent" ? "Recent" : "Unread"}
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onSortChange("recent")}>
              {sortBy === "recent" && <Check className="mr-2 size-4" />}
              <span className={sortBy !== "recent" ? "ml-6" : ""}>
                Most Recent
              </span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onSortChange("unread")}>
              {sortBy === "unread" && <Check className="mr-2 size-4" />}
              <span className={sortBy !== "unread" ? "ml-6" : ""}>
                Unread First
              </span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="relative">
        <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
        <Input
          type="search"
          placeholder="Search conversations..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="h-9 pl-9"
        />
      </div>
      <p className="text-muted-foreground text-right text-xs">
        {conversationCount} conversation{conversationCount !== 1 ? "s" : ""}
      </p>
    </div>
  );
}
