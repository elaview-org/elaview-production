import { useCallback } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

export function useSearchParamsUpdater() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const get = useCallback(
    (key: string) => searchParams.get(key),
    [searchParams]
  );

  const update = useCallback(
    (params: Record<string, string | null>) => {
      const next = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(params)) {
        if (value === null) {
          next.delete(key);
        } else {
          next.set(key, value);
        }
      }
      const qs = next.toString().replaceAll("%3A", ":").replaceAll("%2C", ",");
      router.replace(qs ? `${pathname}?${qs}` : pathname);
    },
    [router, searchParams, pathname]
  );

  return { get, update };
}
