"use client";

import { useState } from "react";
import { Input } from "@/components/primitives/input";
import { Search, X } from "lucide-react";
import { Button } from "@/components/primitives/button";

interface HelpSearchProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

export function HelpSearch({ onSearch, placeholder = "Search help articles..." }: HelpSearchProps) {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  const handleClear = () => {
    setQuery("");
    onSearch("");
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full max-w-2xl">
      <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="pl-10 pr-10 h-12 text-base"
      />
      {query && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
          onClick={handleClear}
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </form>
  );
}
