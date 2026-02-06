"use client";

import { useRef, useState } from "react";
import { Input } from "@/components/primitives/input";
import { IconSearch, IconX } from "@tabler/icons-react";
import { Button } from "@/components/primitives/button";
import { useSearchParamsUpdater } from "@/lib/hooks/use-search-params-updater";

type Props = {
  searchTarget: string;
};

export default function ToolbarSearch({ searchTarget }: Props) {
  const { get, update } = useSearchParamsUpdater();
  const [value, setValue] = useState(() => get("q") ?? "");
  const [prevUrlValue, setPrevUrlValue] = useState(() => get("q") ?? "");
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const urlValue = get("q") ?? "";
  if (urlValue !== prevUrlValue) {
    setPrevUrlValue(urlValue);
    setValue(urlValue);
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setValue(newValue);

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    debounceRef.current = setTimeout(() => {
      update({
        q: newValue || null,
        after: null,
        before: null,
        first: null,
        last: null,
      });
    }, 300);
  };

  const handleClear = () => {
    setValue("");
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    update({
      q: null,
      after: null,
      before: null,
      first: null,
      last: null,
    });
  };

  return (
    <div className="relative w-80">
      <IconSearch className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
      <Input
        placeholder={`Search ${searchTarget}...`}
        className="pr-8 pl-9"
        value={value}
        onChange={handleChange}
      />
      {value && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-1/2 right-1 size-6 -translate-y-1/2"
          onClick={handleClear}
        >
          <IconX className="size-3.5" />
        </Button>
      )}
    </div>
  );
}
