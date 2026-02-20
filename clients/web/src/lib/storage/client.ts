"use client";
import "client-only";

import { useCallback, useRef, useSyncExternalStore } from "react";
import type { StorageKeyDef } from "./_internal/index";
import { setCookieValue, removeCookieValue } from "./_internal/actions";

export { default as storage } from "./storage";
export type { StorageKeyDef } from "./_internal/index";

type StorageHandle<T> = {
  value: T;
  set: (value: T | ((prev: T) => T)) => Promise<void>;
  remove: () => Promise<void>;
};

const STORAGE_CHANGE_EVENT = "storage-change";

function dispatchChange(key: string) {
  window.dispatchEvent(new CustomEvent(STORAGE_CHANGE_EVENT, { detail: { key } }));
}

function parseCookie<T>(key: string, defaultValue: T): T {
  const match = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${key}=`));
  if (!match) return defaultValue;
  const raw = match.slice(key.length + 1);
  try {
    return JSON.parse(decodeURIComponent(raw)) as T;
  } catch {
    return defaultValue;
  }
}

function serializeCookieValue(value: unknown): string {
  return encodeURIComponent(JSON.stringify(value));
}

export function useStorage<T>(keyDef: StorageKeyDef<T>): StorageHandle<T> {
  const { key, backend, defaultValue, cookieOptions } = keyDef._internal;
  const cachedRef = useRef<{ raw: string | null; parsed: T } | null>(null);

  const getSnapshot = useCallback((): T => {
    if (backend === "localStorage") {
      const raw = localStorage.getItem(key);
      if (cachedRef.current && cachedRef.current.raw === raw) {
        return cachedRef.current.parsed;
      }
      const parsed: T =
        raw === null
          ? defaultValue
          : (() => {
              try {
                return JSON.parse(raw) as T;
              } catch {
                return defaultValue;
              }
            })();
      cachedRef.current = { raw, parsed };
      return parsed;
    }

    const raw = document.cookie;
    if (cachedRef.current && cachedRef.current.raw === raw) {
      return cachedRef.current.parsed;
    }
    const parsed = parseCookie(key, defaultValue);
    cachedRef.current = { raw, parsed };
    return parsed;
  }, [key, backend, defaultValue]);

  const getServerSnapshot = useCallback((): T => defaultValue, [defaultValue]);

  const subscribe = useCallback(
    (onStoreChange: () => void) => {
      const handleStorageEvent = (e: StorageEvent) => {
        if (backend === "localStorage" && (e.key === key || e.key === null)) {
          onStoreChange();
        }
      };
      const handleChangeEvent = (e: Event) => {
        const detail = (e as CustomEvent<{ key: string }>).detail;
        if (detail.key === key) {
          onStoreChange();
        }
      };
      window.addEventListener("storage", handleStorageEvent);
      window.addEventListener(STORAGE_CHANGE_EVENT, handleChangeEvent);
      return () => {
        window.removeEventListener("storage", handleStorageEvent);
        window.removeEventListener(STORAGE_CHANGE_EVENT, handleChangeEvent);
      };
    },
    [key, backend]
  );

  const value = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const set = useCallback(
    async (newValue: T | ((prev: T) => T)) => {
      if (cookieOptions?.httpOnly) return;

      const current = getSnapshot();
      const resolved = newValue instanceof Function ? newValue(current) : newValue;

      if (backend === "localStorage") {
        localStorage.setItem(key, JSON.stringify(resolved));
        dispatchChange(key);
        return;
      }

      await setCookieValue(key, serializeCookieValue(resolved), cookieOptions ?? {});
      dispatchChange(key);
    },
    [key, backend, cookieOptions, getSnapshot]
  );

  const remove = useCallback(async () => {
    if (cookieOptions?.httpOnly) return;

    if (backend === "localStorage") {
      localStorage.removeItem(key);
      dispatchChange(key);
      return;
    }

    await removeCookieValue(key);
    dispatchChange(key);
  }, [key, backend, cookieOptions]);

  return { value, set, remove };
}
