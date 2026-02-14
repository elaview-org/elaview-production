"use client";

import { useRef, useState } from "react";
import { Input } from "@/components/primitives/input";
import { IconSearch } from "@tabler/icons-react";
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

  return (
    <div className="relative w-80">
      <IconSearch className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
      <Input
        type="search"
        value={value}
        onChange={handleChange}
        className="pl-9"
        placeholder={`Search ${searchTarget}...`}
      />
    </div>
  );
}
